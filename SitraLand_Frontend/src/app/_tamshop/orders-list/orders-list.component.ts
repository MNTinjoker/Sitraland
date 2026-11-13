import { ChangeDetectorRef, Component, OnDestroy, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MainService } from 'src/app/services/main.service';
import { UtilService } from 'src/app/services/util.service';
import { environment } from 'src/environments/environment';

@Component({
  standalone: false,
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./orders-list.component.css']
})
export class OrdersListComponent implements OnInit, OnDestroy {

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private mainService: MainService,
    private utilService: UtilService
  ) { }

  ordersList: any = [];
  server: string = environment.url + '/images/';
  totalRecords: number = 0;
  loading: boolean = false;
  selectedStatus: number = -1;
  searchTerm: string = '';
  lastLazyEvent: any = { first: 0, rows: 10 };
  sendingIds = new Set<number | string>();
  private search$ = new Subject<string>();
  private loadRequestId = 0;

  ngOnInit() {
    this.search$
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(term => {
      this.changeDetectorRef.markForCheck();
        this.searchTerm = term;
        this.lastLazyEvent = { ...this.lastLazyEvent, first: 0 };
        this.loadOrders(this.lastLazyEvent);
      });

    this.loadOrders(this.lastLazyEvent);
  }

  ngOnDestroy() {
    this.search$.complete();
  }

  onSearch(value: string) {
    this.search$.next(value || '');
  }

  async loadOrders(event: any) {
    this.lastLazyEvent = event || this.lastLazyEvent;

    const first = this.lastLazyEvent.first || 0;
    const rows = this.lastLazyEvent.rows || 10;
    const page = Math.floor(first / rows) + 1;

    const requestId = ++this.loadRequestId;
    this.loading = true;
    this.changeDetectorRef.markForCheck();
    try {
      let response = await this.mainService.getAllBasket(page, rows, this.selectedStatus, this.searchTerm).toPromise();
      if (requestId !== this.loadRequestId) {
        return;
      }

      this.ordersList = response['data'] || [];
      this.totalRecords = response['totalCount'] || 0;

      this.ordersList.forEach((element: any) => {
        element.fullName = (element.name || '') + ' ' + (element.lastName || '');
        element.titles = element.titles ? element.titles.split(',') : [];
        element.product = "";
        if (element.productId && element.count) {
          for (let i = 0; i < element.productId.length; i++) {
            element.product = element.product + (element.titles[i] || '') + ' ' + '(' + element.count[i] + ') ';
          }
        }
      });
    } catch (error: any) {
      if (requestId === this.loadRequestId) {
        this.utilService.showNotify(error?.error?.message || 'خطا در دریافت اطلاعات', 'error');
      }
    } finally {
      if (requestId === this.loadRequestId) {
        this.loading = false;
        this.changeDetectorRef.markForCheck();
      }
    }
  }

  gotoOrderDetail(orderId) {
    this.router.navigate(['/order-detail/' + orderId]);
  }

  filterOrders(id) {
    this.selectedStatus = id;
    this.lastLazyEvent = { ...this.lastLazyEvent, first: 0 };
    this.loadOrders(this.lastLazyEvent);
  }

  isSending(id: any): boolean {
    return this.sendingIds.has(id);
  }

  async sendOrderConfirm(id) {
    if (this.isSending(id)) {
      return;
    }

    const result = await this.utilService.sweetAlert({ title: "آیا از ارسال سفارش  مطمئن هستید ؟", message: '' });
    if (!result || !result.value) {
      return;
    }

    this.sendingIds.add(id);
    this.changeDetectorRef.markForCheck();
    try {
      await this.mainService.sendOrderConfirm(id).toPromise();
      this.utilService.showNotify('وضعیت سفارش به «ارسال شده» تغییر کرد', 'success');
      await this.loadOrders(this.lastLazyEvent);
    } catch (error: any) {
      this.utilService.showNotify(error?.error?.message || 'خطایی پیش آمده', 'error');
    } finally {
      this.sendingIds.delete(id);
      this.changeDetectorRef.markForCheck();
    }
  }
}

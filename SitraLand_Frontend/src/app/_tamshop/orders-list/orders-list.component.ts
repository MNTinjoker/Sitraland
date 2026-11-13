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
  private search$ = new Subject<string>();

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

    this.loading = true;
    try {
      let response = await this.mainService.getAllBasket(page, rows, this.selectedStatus, this.searchTerm).toPromise();

      this.ordersList = response['data'] || [];
      this.totalRecords = response['totalCount'] || 0;

      this.ordersList.forEach(element => {
        element.fullName = (element.name || '') + ' ' + (element.lastName || '');
        element.titles = element.titles ? element.titles.split(',') : [];
        element.product = "";
        if (element.productId && element.count) {
          for (let i = 0; i < element.productId.length; i++) {
            element.product = element.product + (element.titles[i] || '') + ' ' + '(' + element.count[i] + ') ';
          }
        }
      });
    } catch (error) {
      this.utilService.showNotify('خطا در دریافت اطلاعات', 'error');
    } finally {
      this.loading = false;
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

  async sendOrderConfirm(id) {
    this.utilService.sweetAlert({ title: "آیا از ارسال سفارش  مطمئن هستید ؟", message: '' }).then(async result => {
      if (result.value) {
        try {
          await this.mainService.sendOrderConfirm(id).toPromise();
          await this.loadOrders(this.lastLazyEvent);
          this.changeDetectorRef.markForCheck();
        } catch (error) {
          this.utilService.showNotify('خطایی پیش آمده', 'error');
        }

      }
    })
  }
}

import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Table } from 'primeng/table';
import { MainService } from 'src/app/services/main.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  standalone: false,
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {
  @ViewChild(('dt')) dt!: Table;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private utilService: UtilService,
    private mainService: MainService,
  ) { }

  productList: any = [];
  server: string = environment.url + '/images/';
  totalRecords: number = 0;
  loading: boolean = false;
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
        this.loadProducts(this.lastLazyEvent);
      });

    this.loadProducts(this.lastLazyEvent);
  }

  ngOnDestroy() {
    this.search$.complete();
  }

  onSearch(value: string) {
    this.search$.next(value || '');
  }

  async loadProducts(event: any) {
    this.lastLazyEvent = event || this.lastLazyEvent;

    const first = this.lastLazyEvent.first || 0;
    const rows = this.lastLazyEvent.rows || 10;
    const page = Math.floor(first / rows) + 1;

    this.loading = true;
    try {
      let data = await this.mainService.getProducts(
        page,
        rows,
        this.searchTerm,
        this.lastLazyEvent.sortField,
        this.lastLazyEvent.sortOrder !== undefined ? this.lastLazyEvent.sortOrder.toString() : undefined
      ).toPromise();

      this.productList = data['data'] || [];
      this.totalRecords = data['totalCount'] || 0;
      this.productList.forEach((element: { fldIsActiveTitle: string; isActive: any; }) => {
        element.fldIsActiveTitle = element.isActive ? "فعال" : "غیر فعال";
      });
    } catch (error) {
      this.utilService.showNotify('خطا در دریافت اطلاعات', 'error');
    } finally {
      this.loading = false;
    }
  }

  goToProductConfig(id: string) {
    this.router.navigate(['/admin/product-config/' + id]);
  }

  deleteProduct(id: any) {
    this.utilService.sweetAlert({
      message: "از حذف اطمینان دارید؟"
    }).then(async check => {
      if (check.value) {
        try {
          await this.mainService.deleteProduct(id).toPromise();
          this.utilService.showNotify('با موفقیت حذف شد', 'success')
          this.loadProducts(this.lastLazyEvent);
        } catch (error) {
          this.utilService.showNotify('خطایی پیش آمده', 'error')
        }
      }
    });
  }

  goToConfg() {
    this.router.navigate(['admin/product-config/-1'])
  }
}

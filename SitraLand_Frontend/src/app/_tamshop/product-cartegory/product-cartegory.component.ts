import { ChangeDetectorRef, Component, OnDestroy, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SelectItem } from 'primeng/api';
import { CartService } from 'src/app/services/cart.service';
import { UtilService } from 'src/app/services/util.service';
import { MainService } from 'src/app/services/main.service';

@Component({
  standalone: false,
  selector: 'app-product-cartegory',
  templateUrl: './product-cartegory.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./product-cartegory.component.css']
})
export class ProductCartegoryComponent implements OnInit, OnDestroy {

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private mainService: MainService,
    private router: Router,
    private utilService: UtilService,
    private cartService: CartService,
    private activeRoute: ActivatedRoute
  ) { }
  cartegoryId: number = 2;
  title = signal("");
  productList: any = [];
  layoutGird = "grid";
  categoryHomeList: any = [];
  sortOrder!: number;
  sortField!: string;
  sortBar: boolean = false;
  server: string = environment.url + '/images/';
  productCategoryList: any = [];
  sortOptions!: SelectItem[];
  sortKey: string = '';
  isCustomStyle = false;
  totalRecords: number = 0;
  searchTerm: string = '';
  firstRecord: number = 0;
  loadingProducts = false;
  productsError = false;
  private lastLazyEvent: any = { first: 0, rows: 16 };
  private search$ = new Subject<string>();
  // Ignores late responses, so an older search can not overwrite a newer result.
  private loadRequestId = 0;

  async ngOnInit(): Promise<void> {
    this.sortOptions = [
      { label: ' الفبا نزولی', value: '!fldProductTitle' },
      { label: 'الفبا صعودی', value: 'fldProductTitle' },
    ];
    let urlId = +this.activeRoute.snapshot.paramMap.get('id') || -1;
    this.cartegoryId = urlId;
    this.isCustomStyle = false;
    this.searchTerm = this.activeRoute.snapshot.queryParamMap.get('search') ?? '';

    // The search waits a short moment, so typing on a slow phone does not send a
    // request for every letter. Every new search starts from the first page.
    this.search$
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(term => {
        this.searchTerm = term;
        this.firstRecord = 0;
        this.lastLazyEvent = { ...this.lastLazyEvent, first: 0, rows: this.lastLazyEvent.rows || 16 };
        this.loadProducts(this.lastLazyEvent);
      });

    await this.getCategoriess();
  }

  ngOnDestroy(): void {
    this.search$.complete();
  }

  async getCategoriess() {
    let data = await this.mainService.getCategories().toPromise();
    const categories = data['data'] ?? [];

    this.categoryHomeList = [
      { categoryTitle: ' همه کالاها', categoryId: -1 },
      ...categories
    ];

    this.applySelectedCategory(this.cartegoryId);
    this.changeDetectorRef.markForCheck();
  }

  private applySelectedCategory(categoryId: number): void {
    const selected = this.categoryHomeList.find((category: any) => category.categoryId == categoryId) ?? this.categoryHomeList[0];
    this.title.set(selected?.categoryTitle ?? '');
  }

  loadProducts(event: any): void {
    this.lastLazyEvent = event ?? this.lastLazyEvent;

    const first = this.lastLazyEvent.first || 0;
    const rows = this.lastLazyEvent.rows || 16;
    const page = Math.floor(first / rows) + 1;

    // The paginator of the data view follows the page that is shown.
    this.firstRecord = first;

    const requestId = ++this.loadRequestId;
    this.loadingProducts = true;
    this.productsError = false;

    this.mainService.getCategory(this.cartegoryId, page, rows, this.searchTerm).subscribe({
      next: (res) => {
        if (requestId !== this.loadRequestId) {
          return;
        }

        this.productList = res['data'] ?? [];
        this.productList.forEach((product: any, index: number) => {
          product.index = index + 1;
        });
        this.totalRecords = res['totalCount'] ?? 0;
        this.loadingProducts = false;
        this.changeDetectorRef.markForCheck();
      },
      error: () => {
        if (requestId !== this.loadRequestId) {
          return;
        }

        this.productList = [];
        this.totalRecords = 0;
        this.loadingProducts = false;
        this.productsError = true;
        this.utilService.showNotify('خطا در دریافت اطلاعات', 'error');
        this.changeDetectorRef.markForCheck();
      }
    });
  }

  retryLoadProducts(): void {
    this.loadProducts(this.lastLazyEvent);
  }

  onSearch(term: string): void {
    this.search$.next((term ?? '').trim());
  }


  // onSortChange() {
  //   let value = this.sortKey;
  //   if (value.indexOf('!') === 0) {
  //     this.sortOrder = -1;
  //     this.sortField = value.substring(1, value.length);
  //   } else {
  //     this.sortOrder = 1;
  //     this.sortField = value;
  //   }
  // }



  goToProductDetail(id) {
    this.router.navigate(['/product-detail/' + id ]);
  }

  addToCart(id, event?: Event) {
    // The button is inside the card, the card must not open the product.
    if (event) {
      event.stopPropagation();
    }

    try {
      this.cartService.addProduct(id, 1);
      this.utilService.showNotify(`محصول به سبد خریدت اضافه شد `, 'success');
    } catch (error) {
      this.utilService.showNotify('خطا در افزودن به سبد خرید', 'error');
    }
  }

  selectCategory(id) {
    this.cartegoryId = id;
    this.applySelectedCategory(id);
    this.setActiveClassHome(id);
    // A new category always starts at the first page.
    this.firstRecord = 0;
    this.loadProducts({ first: 0, rows: 16 });
  }

  setActiveClassHome(id) {
    // Only the items of the category list, the page has more lists.
    const categoryList = document.getElementById('categoryHomeList');

    if (!categoryList) {
      return;
    }

    categoryList.querySelectorAll('li').forEach(item => {
      item.classList.toggle('active-li-home', +item.getAttribute('data-category-id') == id);
    });
  }

}

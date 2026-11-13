import { ChangeDetectorRef, Component, OnDestroy, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SelectItem } from 'primeng/api';
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
  private lastLazyEvent: any = { first: 0, rows: 16 };
  private search$ = new Subject<string>();

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

    this.mainService.getCategory(this.cartegoryId, page, rows, this.searchTerm).subscribe(res => {
      this.productList = res['data'] ?? [];
      this.productList.forEach((product: any, index: number) => {
        product.index = index + 1;
      });
      this.totalRecords = res['totalCount'] ?? 0;
      this.changeDetectorRef.markForCheck();
    });
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

  async addToCart(id, event?: Event) {
    // The button is inside the card, the card must not open the product.
    if (event) {
      event.stopPropagation();
    }

    try {
      let orders = localStorage.getItem('products');
      let products: any = {
        orders: []
      }

      if (orders) {
        products = this.utilService.decryptData(orders);
      }
      let inCart = products.orders.findIndex(x => x.id == id);
      if (inCart != -1) {
        products.orders[inCart]['Number'] = products.orders[inCart]['Number'] + 1;
      }
      else {
        let number = 1;
        products.orders.push({ id, Number: number });
      }
      localStorage.setItem('products', this.utilService.encryptData(products));
      this.utilService.showNotify(`محصول به سبد خریدت اضافه شد `, 'success');
      this.utilService.checkBasketNumber(null);

    } catch (error) {
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

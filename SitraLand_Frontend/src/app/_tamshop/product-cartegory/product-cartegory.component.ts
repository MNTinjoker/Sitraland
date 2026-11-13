import { ChangeDetectorRef, Component, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
export class ProductCartegoryComponent implements OnInit {

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private mainService: MainService,
    private router: Router,
    private utilService: UtilService,
    private activeRoute: ActivatedRoute
  ) { }
  cartegoryId: number = 2;
  bgImage = signal("");
  // The background image of every category. The ids are read from the database,
  // so the categories are never hardcoded here.
    private static readonly categoryImages: { [key: string]: string } = {
    'موتور': 'engine.svg',
    'گیربکس': 'gearbox.svg',
    'بدنه': 'body.svg',
    'برقی': 'electronic.svg'
  };
  bgList: any[] = [];
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
  private lastLazyEvent: any = { first: 0, rows: 16 };

  /** The image of a category, the title in the database can have a suffix. */
  private categoryImage(title?: string): string | undefined {
    const key = Object.keys(ProductCartegoryComponent.categoryImages).find(name => title?.includes(name));

    return key ? ProductCartegoryComponent.categoryImages[key] : undefined;
  }


  async ngOnInit(): Promise<void> {
    this.sortOptions = [
      { label: ' الفبا نزولی', value: '!fldProductTitle' },
      { label: 'الفبا صعودی', value: 'fldProductTitle' },
    ];
    let urlId = +this.activeRoute.snapshot.paramMap.get('id') || -1;
    this.cartegoryId = urlId;
    this.isCustomStyle = false;
    this.searchTerm = this.activeRoute.snapshot.queryParamMap.get('search') ?? '';
    await this.getCategoriess();
  }

  async getCategoriess() {
    let data = await this.mainService.getCategories().toPromise();
    const categories = data['data'] ?? [];

    this.categoryHomeList = [
      { categoryTitle: ' همه کالاها', categoryId: -1 },
      ...categories
    ];

    this.bgList = this.categoryHomeList.map(category => ({
      id: category.categoryId,
      title: category.categoryTitle,
      src: '../../../assets/images/' + (this.categoryImage(category.categoryTitle) ?? 'more.svg')
    }));

    this.applySelectedCategory(this.cartegoryId);
    this.changeDetectorRef.markForCheck();
  }

  private applySelectedCategory(categoryId: number): void {
    const selected = this.bgList.find(category => category.id == categoryId) ?? this.bgList[0];

    this.title.set(selected?.title ?? '');
    this.bgImage.set(selected?.src ?? '');
  }

  loadProducts(event: any): void {
    this.lastLazyEvent = event ?? this.lastLazyEvent;

    const first = this.lastLazyEvent.first || 0;
    const rows = this.lastLazyEvent.rows || 16;
    const page = Math.floor(first / rows) + 1;

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
    this.searchTerm = term ?? '';
    this.loadProducts({ first: 0, rows: 16 });
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

  async addToCart(id) {
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
    this.loadProducts({ first: 0, rows: 16 });
  }

  setActiveClassHome(id) {
    let div = document.getElementsByTagName('li');
    for (let i = 0; i < div.length; i++) {
      div[i].classList.remove('active-li-home');
    }
    if (id == -1) {
      id = 0
      div[id].classList.add('active-li-home');
    }
    else {
      div[id - 1].classList.add('active-li-home');
    }
  }

}

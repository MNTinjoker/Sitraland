import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { SelectItem } from 'primeng/api';
import { UtilService } from 'src/app/services/util.service';
import { MainService } from 'src/app/services/main.service';

@Component({
  selector: 'app-product-cartegory',
  templateUrl: './product-cartegory.component.html',
  styleUrls: ['./product-cartegory.component.css']
})
export class ProductCartegoryComponent implements OnInit {

  constructor(
    private mainService: MainService,
    private router: Router,
    private utilService: UtilService,
    private activeRoute: ActivatedRoute
  ) { }
  cartegoryId: number = 2;
  bgImage: string = "";
  bgList = [
    {
      src: '',
      id: -1,
      title: ' همه کالاها'
    },
    {
      src: '../../../assets/images/engine.svg',
      id: 2,
      title: ' موتوری'
    },
    {
      src: '../../../assets/images/gearbox.svg',
      id: 3,
      title: ' گیربکس'
    },
    {
      src: '../../../assets/images/body.svg',
      id: 4,
      title: ' بدنه'
    },
    {
      src: '../../../assets/images/electronic.svg',
      id: 5,
      title: 'برقی'
    },
    {
      src: '../../../assets/images/more.svg',
      id: 6,
      title: ' سایر'
    }, 
    {
      src: '../../../assets/images/more.svg',
      id: 7,
      title: ' تخفیف'
    },
  ];
  title: string = "";
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


  ngOnInit(): void {
    this.sortOptions = [
      { label: ' الفبا نزولی', value: '!fldProductTitle' },
      { label: 'الفبا صعودی', value: 'fldProductTitle' },
    ];
    let urlId = +this.activeRoute.snapshot.paramMap.get('id') || -1;
    this.cartegoryId = urlId;
    this.isCustomStyle = false;
    let cartegorySelected = this.bgList.filter(x => x.id == urlId)[0];
    this.title = cartegorySelected['title'];
    this.bgImage = cartegorySelected['src'];
    this.getCategoriess();
  }

  async getCategoriess() {
    let data = await this.mainService.getCategories().toPromise();
    this.categoryHomeList = data['data'];
    let all = {
      categoryTitle: ' همه کالاها',
      categoryId: -1
    }
    this.categoryHomeList.unshift(all);
    setTimeout(() => {
      this.getCategoryProducts(this.cartegoryId);
    }, 1000);

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

  async getCategoryProducts(id) {
    this.setActiveClassHome(id);
    let cartegorySelected = this.bgList.filter(x => x.id == id)[0];
    this.title = cartegorySelected['title'];
    this.bgImage = cartegorySelected['src'];
    try {
      let data = await this.mainService.getCategory(id).toPromise();
      this.productList = [];
      this.productList = data["data"];
      this.productList.forEach((e, index) => {
        e.index = index + 1;
      });
      this.productList = this.productList.sort((a, b) => b.count - a.count)
    } catch (error) {
    }
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

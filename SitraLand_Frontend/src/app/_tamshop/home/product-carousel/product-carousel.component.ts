import { Component, Input, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MainService } from 'src/app/services/main.service';
import { UtilService } from 'src/app/services/util.service';
import { environment } from 'src/environments/environment';

@Component({
  standalone: false,
  selector: 'app-product-carousel',
  templateUrl: './product-carousel.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./product-carousel.component.css']
})
export class ProductCarouselComponent implements OnInit {

  constructor(
    private mainService: MainService,
    private router: Router,
    private utilService: UtilService
  ) { }
  responsiveCarouselOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 3,
      numScroll: 3
    },
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 2
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1
    }
  ];
  server: string = environment.url + '/images/';


  allItemList: any = [];
  hasProduct = signal(false);

  allItemListEngine: any = [];
  hasProductEngine: boolean = false;

  allItemListGearbox: any = [];
  hasProductGearbox: boolean = false;
  statuseText: any;

  @Input() categoryId;

  async ngOnInit() {
    // The view has to be refreshed after the products are loaded.
    await this.getCategoryProducts(this.categoryId);
    this.statuseText = this.categoryId;
  }
  async getCategoryProducts(id) {
    try {
      let data = await this.mainService.getCategory(id).toPromise();
      this.allItemList = [];
      this.allItemList = data["data"];
      if (this.allItemList['length'] > 0) {
        this.hasProduct.set(true);
      }
    } catch (error) {
    }
  }
  // async getCategoryEngine() {
  //   try {
  //     let data = await this.mainService.getCategory(2).toPromise();
  //     this.allItemListEngine = [];
  //     this.allItemListEngine = data["data"];
  //     if (this.allItemListEngine['length'] > 0) {
  //       this.hasProductEngine = true;
  //     }
  //   } catch (error) {
  //   }
  // }

  // async getCategorygearbox() {
  //   try {
  //     let data = await this.mainService.getCategory(3).toPromise();
  //     this.allItemListGearbox = [];
  //     this.allItemListGearbox = data["data"];
  //     if (this.allItemListGearbox['length'] > 0) {
  //       this.hasProductGearbox = true;
  //     }
  //   } catch (error) {
  //   }
  // }

  goToProductDetail(id) {
    this.router.navigate(['/product-detail', id]);
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
      } else {
        products.orders.push({ id, Number: 1 });
      }

      localStorage.setItem('products', this.utilService.encryptData(products));
      this.utilService.showNotify(`محصول به سبد خریدت اضافه شد `, 'success');
      this.utilService.checkBasketNumber(null);
    } catch (error) {
    }
  }

}

import { ChangeDetectorRef, Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UtilService } from '../services/util.service';
import { Router } from '@angular/router';
import { MainService } from 'src/app/services/main.service';

@Component({
  standalone: false,
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./basket.component.css']
})
export class BasketComponent implements OnInit {

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private utilService: UtilService,
    private router: Router,
    private mainService: MainService
  ) { }

  mode: number;
  loader: boolean = false;
  cartDetail: any = [];
  server: string = environment.url + '/images/';
  totalPrice: number = 0;
  totalProduct: number = 0;
  finalPrice: number = 0;
  finalPriceLetters: string;
  productsId: any = [];

  ngOnInit(): void {
    localStorage.getItem('products') ? this.mode = 1 : this.mode = 2;
    this.getCartDetail();
  }

  async getCartDetail() {
    let products = localStorage.getItem('products');
    let temp: any = products ? this.utilService.decryptData(products) : null;

    if (!temp || !temp.orders) {
      // A visitor without a basket gets the empty basket, not an error.
      this.mode = 2;
      this.cartDetail = [];
      this.calculatePrice();
      return;
    }

    let orders = temp.orders;
    await this.getProductsId(orders);
    this.changeDetectorRef.markForCheck();
    let data = await this.mainService.cart(this.productsId).toPromise();
    this.cartDetail = [];
    data.forEach(element => {
      if (element && element[0]) {
        this.cartDetail.push(element[0]);
      }
    });
    for (let i = 0; i < this.cartDetail.length; i++) {
      let index = temp.orders.findIndex(x => x.id == this.cartDetail[i]["productId"]);
      this.cartDetail[i]["fldPurchaseLimit"] = this.cartDetail[i]["count"];
      this.cartDetail[i]["count"] = temp.orders[index]['Number'];
      // this.cartDetail[i]["propertyValue"] = temp.orders[index]['propertyValue'];
    }

    this.calculatePrice();
  }

  removeBasket(id) {
    const products = localStorage.getItem('products');
    const temp: any = products ? this.utilService.decryptData(products) : null;
    const orders = Array.isArray(temp?.orders) ? temp.orders : [];
    const localIndex = orders.findIndex((x: any) => x.id == id);
    if (localIndex !== -1) {
      orders.splice(localIndex, 1);
    }

    this.getProductsId(orders);
    const productIndex = this.cartDetail.findIndex((x: any) => x.productId == id);
    if (productIndex !== -1) {
      this.cartDetail.splice(productIndex, 1);
    }

    if (orders.length === 0) {
      localStorage.removeItem('products');
      this.cartDetail = [];
      this.mode = 2;
    } else {
      localStorage.setItem('products', this.utilService.encryptData({ orders: orders }));
    }

    this.utilService.checkBasketNumber(null);
    this.calculatePrice();
  }

  eventProduct(id, event) {
    const index = this.cartDetail.findIndex((x: any) => x.productId == id);
    if (index === -1) {
      return;
    }

    const product = this.cartDetail[index];
    const limit = Number(product.fldPurchaseLimit) || Number(product.count) || 1;
    const current = Number(product.count) || 1;

    if (event == 1 && current >= limit) {
      return;
    }
    if (event != 1 && current <= 1) {
      return;
    }

    const products = localStorage.getItem('products');
    const temp: any = products ? this.utilService.decryptData(products) : null;
    const orders = Array.isArray(temp?.orders) ? temp.orders : [];
    const orderIndex = orders.findIndex((x: any) => x.id == id);
    if (orderIndex === -1) {
      return;
    }

    const delta = event == 1 ? 1 : -1;
    product.count = current + delta;
    orders[orderIndex]['Number'] = (Number(orders[orderIndex]['Number']) || current) + delta;
    if (orders[orderIndex]['newCount'] != null) {
      orders[orderIndex]['newCount'] = (Number(orders[orderIndex]['newCount']) || 0) - delta;
    }

    localStorage.setItem('products', this.utilService.encryptData({ orders: orders }));
    this.calculatePrice();
  }

  removeAllProduct() {
    localStorage.removeItem('products');
    this.cartDetail = [];
    this.utilService.checkBasketNumber(null);
    this.totalPrice = 0;
    this.totalProduct = 0;
    this.mode = 2;
  }

  async finalSaveOrder(model) {
    sessionStorage.setItem('finalprice', this.finalPrice.toString())
    this.router.navigate(['/checkout-shop']);

  }

  getProductsId(orders) {
    const items = [];
    orders.forEach(async (element) => {
      items.push(element.id);
    });
    this.productsId = items;
  }

  getWithoutVat(price) {
    let courseAmount = 0;
    courseAmount = price / 1.10;
    let amount = Math.round(+courseAmount / 10000) * 10000 || 0;
    return amount;
  }

  async saveOrder() {
    this.utilService.sweetAlert({ title: "آیا از ثبت سفارش  مطمئن هستید ؟", message: '' }).then(async result => {
      if (result.value) {
        let productsJson = [];
        this.cartDetail.forEach(element => {
          let temp = {
            id: element.productId,
            count: element.count,
          }
          productsJson.push(temp);
        });

        let product = {
          products: productsJson,
          totalProduct: this.totalProduct
        }
        localStorage.setItem('productFinalList', this.utilService.encryptData({ Product: product }));
        let model = {
          discount: 0,
          products: productsJson
        }
        await this.finalSaveOrder(model);
        this.changeDetectorRef.markForCheck();
      }
    })
  }

  calculatePrice() {
    this.totalPrice = 0;
    this.finalPrice = 0;
    this.cartDetail.forEach(element => {
      this.totalPrice = this.totalPrice + (element.price * element.count);
      this.finalPrice = this.finalPrice + (element.price * element.count);
    });
    this.totalProduct = 0;
    this.cartDetail.forEach(element => {
      this.totalProduct = this.totalProduct + (element.count);
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UtilService } from '../services/util.service';
import { Router } from '@angular/router';
import { MainService } from 'src/app/services/main.service';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css']
})
export class BasketComponent implements OnInit {

  constructor(
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
    let temp: any = this.utilService.decryptData(products);
    let orders = temp.orders;
    await this.getProductsId(orders);
    let data = await this.mainService.cart(this.productsId).toPromise();
    this.cartDetail = [];
    data.forEach(element => {
      this.cartDetail.push(element[0]);
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
    let products = localStorage.getItem('products');
    let temp: any = this.utilService.decryptData(products);
    let orders = temp.orders
    let localIndex = orders.findIndex(x => x.id == id);
    orders.splice(localIndex, 1);
    this.getProductsId(orders)
    let productIndex = this.cartDetail.findIndex(x => x.productId == id);
    this.cartDetail.splice(productIndex, 1);
    localStorage.setItem('products', this.utilService.encryptData({ orders: orders }));
    this.utilService.checkBasketNumber(null);
    if (this.cartDetail.length == 0) {
      localStorage.removeItem('products');
      this.mode = 2;
    }
  }

  eventProduct(id, event) {
    let index = this.cartDetail.findIndex(x => x.productId == id);
    let products = localStorage.getItem('products');
    let temp: any = this.utilService.decryptData(products);
    let orders = temp.orders
    let orderIndex = orders.findIndex(x => x.id == id);
    if (event == 1) {
      this.cartDetail[index]['count'] = this.cartDetail[index]['count'] + 1;
      orders[orderIndex]['Number'] = orders[orderIndex]['Number'] + 1;
      orders[orderIndex]['newCount'] = orders[orderIndex]['newCount'] - 1;
    }
    else {
      this.cartDetail[index]['count'] = this.cartDetail[index]['count'] - 1;
      orders[orderIndex]['Number'] = orders[orderIndex]['Number'] - 1;
      orders[orderIndex]['newCount'] = orders[orderIndex]['newCount'] + 1;

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
            id: element.fldPkProduct,
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

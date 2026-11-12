import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'jalali-moment';
import { MainService } from 'src/app/services/main.service';
import { UtilService } from 'src/app/services/util.service';
import { environment } from 'src/environments/environment';
declare const $: any

@Component({
  selector: 'app-checkout-shop',
  templateUrl: './checkout-shop.component.html',
  styleUrls: ['./checkout-shop.component.css']
})
export class CheckoutShopComponent implements OnInit {

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private utilService: UtilService,
    private mainService: MainService,
  ) { }
  server: string = environment.url + '/images/';

  selectedAddressData: any = [];
  selectedAddressDataModel: any = {};
  selectedAddress: boolean;
  selectedAddressId: any;
  totalItems: any;
  orderTrackingId: any;
  cartDetail: any = [];
  submit = false;
  showConfirmAddress: boolean = false;
  finalPrice: number;
  defaultFinalPrice: number;
  orderDescription: string;
  receiverName: string;
  buttonTxt: string = 'ثبت سفارش';
  propertyItemsList: any = [];
  textList = []
  step: string = '1';
  finalText: string = 'ذخیره';
  userInfo: any = [];

  async ngOnInit() {
    await this.getCartDetail();
    this.finalPrice = +sessionStorage.getItem('finalprice');
    this.defaultFinalPrice = +sessionStorage.getItem('finalprice');
  }


  fillAddress() {
    this.selectedAddressDataModel = {};
    this.selectedAddressDataModel.fullAddress = this.selectedAddressData['cityName']
      + ',' + this.selectedAddressData['fldMainStreet']
      + ',' + this.selectedAddressData['fldSubStreet']
      + ',' + this.selectedAddressData['fldAlley']
      + ',' + this.selectedAddressData['fldPlate']
      + ',' + this.selectedAddressData['fldUnit'];
    this.selectedAddressDataModel.postalCode = this.selectedAddressData['fldPostalCode'];
    this.selectedAddressDataModel.plaqueNumber = this.selectedAddressData['fldPlate'];
    this.selectedAddressDataModel.unitNumber = this.selectedAddressData['fldUnit'];
    this.selectedAddressId = this.selectedAddressData['fldPkAddress'];
  }

  backToFirstStep() {
    this.step = '1';
  }

  finalOrder() {
    this.step = '3';
  }

  gotoSecondStep() {
    this.step = '2';
  }

  async getCartDetail() {
    let products = localStorage.getItem('products');
    let temp: any = this.utilService.decryptData(products);
    let orders = temp.orders;
    let ids = [];
    let numbers = [];
    let newCounts = [];
    orders.forEach(async (element) => {
      ids.push(element.id);
      numbers.push(element.Number);
      newCounts.push(element.newCount);
    });
    let model = ids;
    this.userInfo.productId = ids;
    this.userInfo.count = numbers;
    this.userInfo.lastCount = newCounts;
    let data = await this.mainService.cart(model).toPromise();
    this.cartDetail = [];
    data.forEach(element => {
      this.cartDetail.push(element[0]);
    });
    let productNames = [];
    this.cartDetail.forEach(element => {
      productNames.push(element.productName);

    });
    this.userInfo.productNames = productNames.join(',');


    let products2 = localStorage.getItem('productFinalList');
    let temp2: any = this.utilService.decryptData(products2);
    let orderList = temp2.Product;
    this.totalItems = orderList.totalProduct;
  }


  confirmAddressModal() {
    if (!this.userInfo.name || !this.userInfo.lastName || !this.userInfo.mobile || !this.userInfo.nationalCode || !this.userInfo.State
      || !this.userInfo.address
    ) {
      this.utilService.showNotify('لطفا تمامی موارد را وارد کنید', "error");
      return;
    }
    this.receiverName = this.userInfo.name + ' ' + this.userInfo.lastName;
    this.showConfirmAddress = true;
  }

  async confirmAddress() {
    this.utilService.showNotify("با موفقیت ثبت شد", "success");
    this.showConfirmAddress = false;
    this.step = '2';
  }


  async finalApproval() {
    this.utilService.sweetAlert({
      title: "از تکمیل سفارشت مطمئنی؟",
      text: '',
    }).then(async (data) => {
      if (data.value) {
        let model = {
          name: this.userInfo.name,
          lastName: this.userInfo.lastName,
          address: this.userInfo.address,
          nationalCode: this.userInfo.nationalCode,
          count: this.userInfo.count,
          productId: this.userInfo.productId,
          mobile: this.userInfo.mobile,
          status: 0,
          basketCode: null,
          tozihat: this.userInfo.orderDescription,
          ostan: this.userInfo.State,
          titles: this.userInfo.productNames,
          lastCount: this.userInfo.lastCount,
          basketDate: moment().format('jYYYY/jMM/jDD'),
          totalPrice: this.finalPrice
        }
        try {
          let data = await this.mainService.saveOrder(model).toPromise();
          this.orderTrackingId = data['message'];
          localStorage.removeItem("products");
          $(".basket-num").attr('data-content', '');
          document.getElementsByClassName('basket-num')[0]['children'][0].classList.remove('iconboxBlinker');
          this.submit = false;
          this.step = '3';
        } catch (error) {

        }

      }
    }).then(data => {
    })
  }


  gotoBasket() {
    this.router.navigate(['/orders']);
  }

  gotoTamShop() {
    this.router.navigate(['/home']);
  }

  cancelConfirmAddress() {
    this.showConfirmAddress = false;
  }

}

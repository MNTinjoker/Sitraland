import { ChangeDetectorRef, Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import moment from 'jalali-moment';
import { CartService } from 'src/app/services/cart.service';
import { MainService } from 'src/app/services/main.service';
import { UtilService } from 'src/app/services/util.service';
import { environment } from 'src/environments/environment';

@Component({
  standalone: false,
  selector: 'app-checkout-shop',
  templateUrl: './checkout-shop.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./checkout-shop.component.css']
})
export class CheckoutShopComponent implements OnInit {

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private utilService: UtilService,
    private cartService: CartService,
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
  finalPrice: number = 0;
  defaultFinalPrice: number = 0;
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
    this.changeDetectorRef.markForCheck();
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
    const orders = this.cartService.getOrders();
    if (!orders.length) {
      this.router.navigate(['/basket']);
      return;
    }

    const ids = orders.map((o: any) => o.id);

    try {
      const data = await this.mainService.cart(ids).toPromise();
      this.cartDetail = [];
      if (Array.isArray(data)) {
        data.forEach((element: any) => {
          if (element && element[0]) {
            this.cartDetail.push(element[0]);
          }
        });
      }

      const orderedIds: any[] = [];
      const numbers: any[] = [];
      const newCounts: any[] = [];
      const names: string[] = [];
      let total = 0;
      let items = 0;

      this.cartDetail.forEach((product: any) => {
        const order = orders.find((o: any) => o.id == product.productId);
        const count = Number(order?.Number) || 1;
        product.orderCount = count;
        orderedIds.push(product.productId);
        numbers.push(count);
        newCounts.push(order?.newCount);
        names.push(product.productName);
        total += (Number(product.price) || 0) * count;
        items += count;
      });

      if (!this.cartDetail.length) {
        this.router.navigate(['/basket']);
        return;
      }

      this.userInfo.productId = orderedIds;
      this.userInfo.count = numbers;
      this.userInfo.lastCount = newCounts;
      this.userInfo.productNames = names.join(',');
      this.totalItems = items;
      this.finalPrice = total;
      this.defaultFinalPrice = total;
    } catch (error) {
      this.utilService.showNotify('خطا در دریافت اطلاعات سبد خرید', 'error');
      this.router.navigate(['/basket']);
    }
  }


  confirmAddressModal() {
    if (!this.userInfo.name || !this.userInfo.lastName || !this.userInfo.mobile || !this.userInfo.nationalCode || !this.userInfo.State
      || !this.userInfo.address
    ) {
      this.utilService.showNotify('لطفا تمامی موارد را وارد کنید', "error");
      return;
    }

    const mobile = String(this.userInfo.mobile || '').trim();
    const nationalCode = String(this.userInfo.nationalCode || '').trim();
    if (!/^09\d{9}$/.test(mobile)) {
      this.utilService.showNotify('شماره موبایل معتبر نیست', "error");
      return;
    }
    if (!/^\d{10}$/.test(nationalCode)) {
      this.utilService.showNotify('کد ملی معتبر نیست', "error");
      return;
    }

    this.userInfo.mobile = mobile;
    this.userInfo.nationalCode = nationalCode;
    this.receiverName = this.userInfo.name + ' ' + this.userInfo.lastName;
    this.showConfirmAddress = true;
  }

  async confirmAddress() {
    this.utilService.showNotify("با موفقیت ثبت شد", "success");
    this.showConfirmAddress = false;
    this.step = '2';
  }


  async finalApproval() {
    if (this.submit) {
      return;
    }

    if (!Array.isArray(this.userInfo.productId) || this.userInfo.productId.length === 0 || !(this.finalPrice > 0)) {
      this.utilService.showNotify('سبد خرید نامعتبر است، لطفا دوباره بررسی کنید', 'error');
      return;
    }

    const confirm = await this.utilService.sweetAlert({
      title: "از تکمیل سفارشت مطمئنی؟",
      message: '',
    });
    if (!confirm || !confirm.value) {
      return;
    }

    this.submit = true;
    this.buttonTxt = 'در حال ثبت...';
    this.changeDetectorRef.markForCheck();

    const model = {
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
    };

    try {
      const res: any = await this.mainService.saveOrder(model).toPromise();
      if (!res || res['code'] != 200) {
        this.utilService.showNotify(res?.['message'] || 'خطا در ثبت سفارش', 'error');
        return;
      }

      this.orderTrackingId = res['message'];
      this.cartService.clear();
      localStorage.removeItem("productFinalList");
      this.step = '3';
    } catch (error: any) {
      this.utilService.showNotify(error?.error?.message || 'خطا در ثبت سفارش، دوباره تلاش کنید', 'error');
    } finally {
      this.submit = false;
      this.buttonTxt = 'ثبت سفارش';
      this.changeDetectorRef.markForCheck();
    }
  }


  gotoBasket() {
    this.router.navigate(['/basket']);
  }

  gotoTamShop() {
    this.router.navigate(['/home']);
  }

  cancelConfirmAddress() {
    this.showConfirmAddress = false;
  }

}

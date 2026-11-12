import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MainService } from 'src/app/services/main.service';

// import { ShopService } from 'src/app/_services/shop.service';
// import { UtilService } from 'src/app/_services/util.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  constructor(
    // private mai: MainService,
    // private utilService: UtilService,
    private mainService: MainService,
    private router: ActivatedRoute
  ) { }
  product: any = [];
  productDetailList: any = [];
  productId: any;
  editMode: boolean = false;
  title: string="";
  userType: number=0;

  ngOnInit(): void {
    // this.userType = this.utilService.checkUserType();
    this.productId = +window.location.pathname.split('/')[2];
    this.router.queryParams.subscribe(params => {
      this.title = params['data'];
    });
    this.getProductDetail();
  }

  async saveProductDetail() {
    // if (!this.product.merchantPrice || !this.product.tamlandPrice
    //   || !this.product.salesProfitPrice) {
    //   this.utilService.showNotify('لطفا همه فیلد هارو پر کنید ', "error");
    //   return;
    // }
    if (!this.editMode) {
      this.product.id = -1;
    }

    let model = {
      id: this.product.id,
      productId: this.productId,
      merchantPrice: +this.product.merchantPrice,
      tamlandPrice: +this.product.tamlandPrice,
      salesProfitPrice: +this.product.salesProfitPrice,
      discountPercent: +this.product.discountPercent,
      isActive: this.product.isActive ? 1 : 0,
      coinPercentage: this.product.coinPercentage || 0
    }
    try {
      let data :any={}
       data = await this.mainService.saveProductDetail(model).toPromise();
      if (data['data'][0]['status'] == 0) {
        this.mainService.showNotify("با موفقیت ذخیره شد", "success");
        this.product = [];
        this.editMode = false;
        this.getProductDetail();
      }
    } catch (error) {
    }
  }

  async getProductDetail() {
    let data = await this.mainService.getProductDetail(this.productId).toPromise();
    this.productDetailList = data['data'];
    this.productDetailList.forEach((element: { fldIsActiveTitle: string; fldIsActive: any; }) => {
      element.fldIsActiveTitle = element.fldIsActive ? "فعال" : "غیر فعال";
    });
  }

  edit(product: { [x: string]: any; }) {
    this.editMode = true;
    this.product.id = product['fldPkDetailProduct'];
    this.product.merchantPrice = product['fldTamPriceSellers'];
    this.product.tamlandPrice = product['fldTamPriceAdmin'];
    this.product.salesProfitPrice = product['fldTamPriceSalesProfit'];
    this.product.discountPercent = product['fldDiscountPercent'];
    this.product.isActive = product['fldIsActive'];
    this.product.coinPercentage = product['fldCoinPercentage'];
  }

}

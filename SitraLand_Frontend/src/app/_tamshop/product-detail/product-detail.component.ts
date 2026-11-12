import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { environment } from 'src/environments/environment';
import swal from "sweetalert2";
import { Router } from '@angular/router';
import { LightboxService } from 'src/app/share/lightbox.service';
import { UtilService } from 'src/app/services/util.service';
import { MainService } from 'src/app/services/main.service';


@Component({
  standalone: false,
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  constructor(
    private utilService: UtilService,
    private router: Router,
    private _lightbox: LightboxService,
    private mainService: MainService
  ) { }

  server: string = environment.url + '/images/';
  productId: number = 0;
  productDetail: any = null;
  loader: boolean = true;
  propertyOption: any;
  propertyString: string = '';
  galleryImages: string[] = [];
  mainImage: string = '';
  txtPropertyList: any = [];
  textList: any = [];
  public album: any = [];
  productThumbCarouselOption: any = { navText: ['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>'], items: 3, dots: false, nav: false };
  categoryId: any;

  async ngOnInit() {
    this.productId = +window.location.pathname.split('/')[2];
    await this.getDetails();
    await this.getProductGallery();
    this.propertyOption = {
      multiple: false,
      tags: false,
    }
  }

  async getDetails() {
    let data = await this.mainService.getProduct(this.productId).toPromise();
    this.productDetail = data['data'] ? data['data'][0] : null;
    this.categoryId = this.productDetail ? this.productDetail['categoryId'] : null;

    this.loader = false;
  }

  async getProductGallery() {
    this.galleryImages = [];
    if (this.productDetail && this.productDetail.imageFolderPath) {
      this.galleryImages.push(this.productDetail.imageFolderPath);
    }

    try {
      let res = await this.mainService.getProductGallery(this.productId).toPromise();
      (res['data'] || []).forEach((path: string) => {
        if (path && this.galleryImages.indexOf(path) === -1) {
          this.galleryImages.push(path);
        }
      });
    } catch (error) {
      this.utilService.showNotify('خطا در دریافت گالری تصاویر', 'error');
    }

    this.mainImage = this.galleryImages.length > 0 ? this.galleryImages[0] : '';
  }

  async addToCart() {
    let id = this.productId;
    try {
      let orders = localStorage.getItem('products');
      let products: any = {
        orders: []
      }

      if (orders) {
        products = this.utilService.decryptData(orders);
      }

      this.productDetail.addInCart = true;
      let inCart = products.orders.findIndex(x => x.id == id);
      if (inCart != -1) {
        products.orders[inCart]['Number'] = products.orders[inCart]['Number'] + 1;
        products.orders[inCart]['newCount'] = products.orders[inCart]['newCount'] - 1;
      }
      else {
        let number = 1;
        products.orders.push({
          id,
          Number: number,
          newCount: this.productDetail.count - number,
          propertyValue: this.propertyString,
          purchaseLimit: this.productDetail.fldPurchaseLimit,
          category: this.productDetail.category
        });
      }

      localStorage.setItem('products', this.utilService.encryptData(products));
      this.utilService.showNotify(`محصول به سبد خریدت اضافه شد `, 'success');
      this.utilService.checkBasketNumber(null);

      if (this.productDetail.category != '13') {
        const swalWithBootstrapButtons: any = (swal as any).mixin({
          customClass: {
            confirmButton: "btn btn-success mx-1",
            cancelButton: "btn btn-warning",
          },
          buttonsStyling: false,
        });
        swalWithBootstrapButtons.fire({
          title: "با موفقیت ثبت شد",
          html: this.getPropertyText(),
          type: "success",
          showCancelButton: true,
          confirmButtonText: "اضافه کردن به سفارش",
          cancelButtonText: "پرداخت و نهایی کردن خرید",
          reverseButtons: false,
        })
          .then(async (result) => {
            if (result.value) {

            } else {
              this.router.navigate(['/basket'])
            }
          });
      }
    } catch (error) {
    }
  }

  getPropertyText() {
    let textList = [
      '<div class="text-end">',
      '<p  style="font-size:12px" class="sweetP">جزئیات سفارش به شرح زیر است</p>',
      `<p style="font-size:12px" > کالا : <span style="font-weight:bold" > ${this.productDetail.productName} </span></p >`,
      `<p style="font-size:12px" > به تعداد: <span  style="font-weight:bold">۱ عدد </span></p >`,
      `<p style="font-size:12px" > قیمت کلی: <span  style="font-weight:bold"> ${(this.productDetail.price).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')} ریال </span></p >`
    ]
    this.txtPropertyList.forEach(item => {
      textList.push(`<p style="font-size:12px"> <span style="font-weight:bold">  ${item.title} : ${item.value}</span></p>`)
    });
    textList.push('</div>');
    let finalText = '';
    textList.forEach(txt => finalText += txt)
    this.textList.push(finalText);
    let textArray = this.textList
    let text = '';
    textArray.forEach(element => {
      text += element
    });
    return text;
  }

  open(src): void {
    this.album = [];
    let startIndex = 0;

    this.galleryImages.forEach((image, index) => {
      if (image === src) {
        startIndex = index;
      }
      this.album.push({
        type: 'image',
        src: this.server + image
      });
    });

    if (this.album.length === 0) {
      return;
    }

    this._lightbox.open(this.album, startIndex, { showZoom: true, showImageNumberLabel: true, alwaysShowNavOnTouchDevices: true, centerVertically: false });
  }


  close(): void {
    this._lightbox.close();
  }

  changeimage(image: string) {
    this.mainImage = image;
  }
}

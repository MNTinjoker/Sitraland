import { ChangeDetectorRef, Component, OnDestroy, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { environment } from 'src/environments/environment';
import swal from "sweetalert2";
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LightboxService } from 'src/app/share/lightbox.service';
import { CartService } from 'src/app/services/cart.service';
import { UtilService } from 'src/app/services/util.service';
import { MainService } from 'src/app/services/main.service';


@Component({
  standalone: false,
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private utilService: UtilService,
    private cartService: CartService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private _lightbox: LightboxService,
    private mainService: MainService
  ) { }

  server: string = environment.url + '/images/';
  productId: number = 0;
  productDetail: any = null;
  loader: boolean = true;
  notFound: boolean = false;
  propertyOption: any;
  propertyString: string = '';
  galleryImages: string[] = [];
  mainImage: string = '';
  txtPropertyList: any = [];
  textList: any = [];
  public album: any = [];
  productThumbCarouselOption: any = { navText: ['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>'], items: 3, dots: false, nav: false };
  categoryId: any;
  private routeSub?: Subscription;

  ngOnInit() {
    this.propertyOption = {
      multiple: false,
      tags: false,
    };

    this.routeSub = this.activeRoute.paramMap.subscribe(async params => {
      const id = +(params.get('id') || 0);
      if (!id) {
        this.productDetail = null;
        this.notFound = true;
        this.loader = false;
        this.changeDetectorRef.markForCheck();
        return;
      }

      this.productId = id;
      await this.loadProduct();
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }

  private async loadProduct() {
    this.loader = true;
    this.notFound = false;
    this.productDetail = null;
    this.galleryImages = [];
    this.mainImage = '';
    this.changeDetectorRef.markForCheck();

    try {
      const data = await this.mainService.getProduct(this.productId).toPromise();
      this.productDetail = data?.['data'] ? data['data'][0] : null;
      this.categoryId = this.productDetail ? this.productDetail['categoryId'] : null;

      if (!this.productDetail) {
        this.notFound = true;
        return;
      }

      await this.getProductGallery();
    } catch (error) {
      this.utilService.showNotify('خطا در دریافت اطلاعات محصول', 'error');
      this.notFound = true;
    } finally {
      this.loader = false;
      this.changeDetectorRef.markForCheck();
    }
  }

  async getProductGallery() {
    this.galleryImages = [];
    if (this.productDetail && this.productDetail.imageFolderPath) {
      this.galleryImages.push(this.productDetail.imageFolderPath);
    }

    try {
      let res = await this.mainService.getProductGallery(this.productId).toPromise();
      (res?.['data'] || []).forEach((path: string) => {
        if (path && this.galleryImages.indexOf(path) === -1) {
          this.galleryImages.push(path);
        }
      });
    } catch (error) {
      // The gallery is optional; the main product image is still shown.
    }

    this.mainImage = this.galleryImages.length > 0 ? this.galleryImages[0] : '';
  }

  addToCart() {
    if (!this.productDetail || this.productDetail.count < 1) {
      return;
    }

    try {
      const orders = this.cartService.getOrders();
      const index = orders.findIndex((x: any) => x.id == this.productId);
      if (index !== -1) {
        orders[index]['Number'] = (Number(orders[index]['Number']) || 0) + 1;
        if (orders[index]['newCount'] != null) {
          orders[index]['newCount'] = (Number(orders[index]['newCount']) || 0) - 1;
        }
      } else {
        orders.push({
          id: this.productId,
          Number: 1,
          newCount: (Number(this.productDetail.count) || 1) - 1,
          propertyValue: this.propertyString,
          purchaseLimit: this.productDetail.fldPurchaseLimit,
          category: this.productDetail.category
        });
      }

      this.cartService.setOrders(orders);
      this.utilService.showNotify(`محصول به سبد خریدت اضافه شد `, 'success');

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
          confirmButtonText: "ادامه خرید",
          cancelButtonText: "رفتن به سبد خرید",
          reverseButtons: false,
        }).then((result: any) => {
          if (result && !result.value) {
            this.router.navigate(['/basket']);
          }
        });
      }
    } catch (error) {
      this.utilService.showNotify('خطا در افزودن به سبد خرید', 'error');
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

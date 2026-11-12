import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import swal from "sweetalert2";
import { Router } from '@angular/router';
import { Lightbox, LightboxConfig } from 'ngx-lightbox';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { UtilService } from 'src/app/services/util.service';
import { MainService } from 'src/app/services/main.service';


@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  constructor(
    private utilService: UtilService,
    private router: Router,
    private _lightbox: Lightbox,
    private mainService: MainService
  ) { }
  productImages = [{ url: 'assets/images/produit1.jpg' },
  { url: 'assets/images/produit2.jpg' },
  { url: 'assets/images/produit3.jpg' }]

  server: string = environment.url + '/images/';
  selectedImage: string = '';
  imageSize = 430;
  productId: number = 0;
  productDetail: any = [];
  loader: boolean = true;
  propertyList: any = [];
  model: any[] = [];
  propertyOption: any;
  propertyString: string = '';
  firstItem = [];
  imageGallery: any = [];
  isShowAddToCart: boolean = true;
  txtPropertyList: any = [];
  textList: any = [];
  public album: any = [];
  productCarouselOption: OwlOptions = { navText: ['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>'], items: 1, dots: false, nav: true };
  productThumbCarouselOption: any = { navText: ['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>'], items: 3, dots: false, nav: false };
  responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 5
    },
    {
      breakpoint: '768px',
      numVisible: 3
    },
    {
      breakpoint: '560px',
      numVisible: 1
    }
  ];
  // settings = {
  //   counter: false,
  //   plugins: [lgZoom]
  // };
  // onBeforeSlide = (detail: BeforeSlideDetail): void => {
  //   const { index, prevIndex } = detail;
  //   console.log(index, prevIndex);
  // };

  showGalleryBox: boolean = false;
  @ViewChild('owlPr', { static: false }) owlCar: any;
  categoryId:any;

  async ngOnInit() {
    this.productId = +window.location.pathname.split('/')[2];
    await this.getDetails();
    // await this.getProperties();
    // await this.getProductGallery();
    this.propertyOption = {
      multiple: false,
      tags: false,
    }
  }
  async getDetails() {
    let data = await this.mainService.getProduct(this.productId).toPromise();
    this.productDetail = data['data'][0];
    this.categoryId = this.productDetail['categoryId'];

    this.loader = false;
  }

  // async getProperties() {
  //   let res: any = await this.shopService.getProductProperty(this.mProductId).toPromise();
  //   if (res && res.data.length > 0) {
  //     res.data.forEach(element => {
  //       let splitList = element.fldFkPropertyValue.split(',');
  //       let splitTitleList = element.fldPropertyValueTitle.split(',');
  //       element.propertyValueList = [{ id: 0, title: '' }]
  //       splitList.forEach((elem, id) => {
  //         element.propertyValueList.push({ id: elem, title: splitTitleList[id] })
  //       });
  //     });

  //     res.data.forEach(element => {
  //       element.propertyValueList.forEach(elem => {
  //         elem.id = elem.id,
  //           elem.text = elem.title
  //       });
  //     });
  //   }

  //   this.propertyList = res.data;
  //   this.propertyList.forEach(element => {
  //     this.firstItem.push({ id: element.propertyValueList[0].id, cat: element.fldFkProperty })
  //   });
  //   let arrayList = [];
  //   this.firstItem.forEach(item => arrayList.push(item.id))
  //   this.propertyString = arrayList.join(',');
  //   this.checkShowAddtoCart();
  // }

  async addToCart() {
    let id = this.productId;
    try {
      let orders = localStorage.getItem('products');
      let products:any = {
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
          newCount : this.productDetail.count - number,
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

  // async selectedProperty(e, element) {
  //   this.firstItem.forEach((item) => {

  //     if (item.cat == element.fldFkProperty) {
  //       item.id = e
  //     }
  //   })
  //   let arrayList = [];
  //   this.firstItem.forEach((item) => arrayList.push(item.id));
  //   this.propertyString = arrayList.join(',');
  //   this.checkShowAddtoCart();
  // }

  // async getProductGallery() {
  //   let list = []
  //   list.push({ index: 0, url: this.productDetail.fldProductImageUrl });
  //   try {
  //     let res: any = await this.shopService.getProductImage(this.mProductId).toPromise();
  //     list = [...list, ...res.data];
  //     list.forEach((element, index) => {
  //       if (element.fldPictureUrl) {
  //         element.url = element.fldPictureUrl;
  //         element.index = element.fldPkPictureProduct;
  //         element.type = element.fldPictureUrl.split('.')[1];
  //       }
  //       element.imageIndex = index;
  //     });
  //     this.imageGallery = [...list]
  //   } catch (error) {
  //     this.utilService.showNotify('خطا در دریافت اطلاعات', 'error')
  //   }
  // }

  // checkShowAddtoCart() {
  //   this.txtPropertyList = [];
  //   let propertyIdList = this.propertyString.split(',');
  //   let idArray = [];
  //   propertyIdList.forEach(item => {
  //     if (item == '0') {
  //       idArray.push(false)
  //     } else {
  //       idArray.push(true)
  //     }
  //   })
  //   this.isShowAddToCart = idArray.includes(false) ? false : true;
  //   if (this.isShowAddToCart) {
  //     propertyIdList.forEach(el => {
  //       this.propertyList.forEach(element => {
  //         let splitList = element.fldFkPropertyValue.split(',');
  //         let splitTitleList = element.fldPropertyValueTitle.split(',');
  //         splitList.forEach((elem, id) => {
  //           if (el == elem) {
  //             this.txtPropertyList.push({ title: element.fldTitleProperty, value: splitTitleList[id] })
  //           }
  //         });
  //       });
  //     })

  //   }
  // }

  getPropertyText() {
    let textList = [
      '<div class="text-right">',
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
    // this.imageGallery.forEach(element => {
    //   let type;
    //   if (element.url?.toLowerCase().endsWith("mp4") ||
    //     element.url?.toLowerCase().endsWith("m4v") ||
    //     element.url?.toLowerCase().endsWith("m3u8")) {
    //     type = 'video';
    //     return
    //   }
    //   else {
    //     type = 'image';
    //   }
    //   let album = {
    //     type: type,
    //     src: this.server + "shop/" + element.url
    //   }
    //   this.album.push(album);
    // });
       let album = {
        type: 'image',
        src: src
      }
      this.album.push(album);
    this._lightbox.open(this.album, 0, { showZoom: true, showImageNumberLabel: true, alwaysShowNavOnTouchDevices: true, centerVertically: false });
  }


  close(): void {
    this._lightbox.close();
  }

  changeimage(image: string) {
    this.selectedImage = image;
  }

  // displayGalleryBox(id) {
  //   this.showGalleryBox = true;
  //   this.productCarouselOption.startPosition = id;
  //   let close = document.createElement('i');
  //   close.className = 'fa fa-times pointer text-light h2 mb-0 close-btn';
  //   setTimeout(() => {
  //     let element: any = document.getElementById('modalGalleryBox');
  //     element.getElementsByClassName('gallery-body')[0]['id'] = 'closeBtn';
  //     // element.getElementsByClassName('owl-nav')[0]['id'] = 'closeBtn';
  //     document.getElementById('closeBtn').appendChild(close);
  //     close.addEventListener("click", () => { this.showGalleryBox = false });
  //   }, 1000);
  // }
}

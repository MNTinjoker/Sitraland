import { ChangeDetectorRef, Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, timer } from 'rxjs';
import { MainService } from 'src/app/services/main.service';
import { environment } from 'src/environments/environment';
import { trigger, state, transition, style, animate } from '@angular/animations';

@Component({
  standalone: false,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        transform: 'scale(0,0)'
      })),
      transition('void <=> *', animate(300)),
    ])]
})
export class homeComponent implements OnInit {

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private mainService: MainService,
    private router: Router,
  ) { }

  //   discontItemList: any = [];
  allItemList: any = [];
  //   onlyTamCoinProduct: any = [];
  //   popularItemList: any = [];
  //   bestSellerItemList: any = [];
  //   newItemList: any = [];
  //   promotions: any = [];
  //   adsCarousel: any = [];
  //   categories: any = [];
  //   isMobileSize: boolean;
  //   ads: any;
  //   url = environment.ftpUrl;
  //   adTimer: Subscription;
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

  //   productCategoryList: any = [];
  server: string = environment.url + '/images/';
  //   flipBoxList = [
  //     { index: 1, img: '../../../assets/images/invitation.png', title: 'دوستاتو دعوتت کن!', backHeader: 'دوستایی که تو تاملند نیستن رو دعوت کن ، به شرط ثبت نام یکی از دوره ها 200 تام‌کوین بگیر', backImg: '../../../assets/images/coin.png', backTitle: '200 تام کوین' },
  //     { index: 2, img: '../../../assets/images/giveaway 1.png', title: 'ویدیوی آنباکس یادت نره!', backHeader: 'از کالایی که خریدی یه ویدیو آنباکس بگیر و برای ما بفرست و 70 تا تام‌کوین جایزه بگیر', backImg: '../../../assets/images/coin.png', backTitle: '70 تام کوین' },
  //     { index: 3, img: '../../../assets/images/profile.png', title: 'پروفایلتو تکمیل کن!', backHeader: 'با تکمیل کردن اطلاعات پروفایل پنل کاربری به صورت کامل می تونید 50 تام کوین کسب کنید', backImg: '../../../assets/images/coin.png', backTitle: '50 تام کوین' },
  //     { index: 4, img: '../../../assets/images/winner.png', title: 'مسابقه ها رو از دست نده!', backHeader: 'با شرکت در مسابقه ها و کمپین ها میتوانی مقدار تام کوین اون رویداد رو از آن خودت کنی ', backImg: '../../../assets/images/coin.png', backTitle: 'متغیر' },
  //     { index: 5, img: '../../../assets/images/online-learning.png', title: 'دوره‌ها رو ثبت‌نام کن', backHeader: 'میتونی با ثبت نام هر کدام از دوره های تاملند تا 1% قیمت اون دوره تام کوین بگیری', backImg: '../../../assets/images/coin.png', backTitle: '%1 قیمت دوره' },
  //   ]

  //   bgList = [
  //     { src: '../../../assets/images/bg-accessory-home.png', id: 4 },
  //     { src: '../../../assets/images/bg-book-home.png', id: 2 },
  //     { src: '../../../assets/images/bg-digital-product-home.png', id: 5 },
  //     { src: '../../../assets/images/bg-note-home.png', id: 1 },
  //     { src: '../../../assets/images/bg-Stationery-home.png', id: 3 },
  //   ];
  //   categoryImgList =
  //     [
  //       { id: 5, src: "../../../assets/images/digital.png" },
  //       { id: 8, src: "../../../assets/images/mug.png" },
  //       { id: 3, src: "../../../assets/images/tahrir.png" },
  //       { id: 9, src: "../../../assets/images/shirt.png" },
  //       { id: 4, src: "../../../assets/images/accs.png" },
  //       { id: 10, src: "../../../assets/images/book02.png" },
  //       { id: 11, src: "../../../assets/images/game.png" },
  //       { id: 12, src: "../../../assets/images/handmade.png" },
  //       { id: 14, src: "../../../assets/images/teacher-day.png" },
  //     ]
  categoryId = -1;

  // The categories are read from the database, the ids are never hardcoded.
    private static readonly categoryImages: { [key: string]: string } = {
    'موتور': 'engine.svg',
    'گیربکس': 'gearbox.svg',
    'بدنه': 'body.svg',
    'برقی': 'electronic.svg'
  };
  categories: any[] = [];

  /** The image of a category, the title in the database can have a suffix. */

  private categoryImage(title?: string): string | undefined {

    const key = Object.keys(homeComponent.categoryImages).find(name => title?.includes(name));

    return key ? homeComponent.categoryImages[key] : undefined;

  }

  async ngOnInit() {
    const data = await this.mainService.getCategories().toPromise();

    this.categories = (data['data'] ?? []).map(category => ({
      id: category.categoryId,
      title: category.categoryTitle,
      src: '../../../assets/images/' + (this.categoryImage(category.categoryTitle) ?? 'more.svg')
    }));
  }

  //     let res = await this.getCategoryProducts(-1, -1);
  //     if (res && res.length != 0) {
  //       this.allItemList = res;
  //     }
  //     res.forEach(element => {
  //       if (element.fldCoinPercentage == '100') {
  //         this.onlyTamCoinProduct.push(element)
  //       }
  //     });
  //     this.promotions = await this.mainService.loadUserPromotion(7, -1, 1).toPromise();
  //     this.promotions = this.promotions['data'];
  //     this.ads = this.promotions ? this.promotions[0] : null;
  //     await this.getCategories()
  //   }
  //   async getCategories() {
  //     try {
  //       let res: any = await this.shopService.getCategories().toPromise();
  //       this.categories = res.data && res.data.length >= 1 ? res.data : [];
  //       this.categories.forEach((category, index) => {
  //         if (!this.categoryImgList.find(item => item.id == category.fldPkCategory)) {
  //           category.src = null;
  //         } else {
  //           category.src = this.categoryImgList.find(item => item.id == category.fldPkCategory).src
  //         }
  //       });
  //       this.categories = this.categories.filter(item => item.src)
  //     } catch (error) {
  //     }
  //   }
  //   async getProductCategory() {
  //     let data = await this.shopService.getProductCategory().toPromise();
  //     let temp: any = {};
  //     data['data'].forEach(element => {
  //       temp.id = element.fldPkCategory;
  //       temp.text = element.fldCategoryTitle;
  //       temp.src = this.bgList.filter(x => x.id == element.fldPkCategory)[0]['src'];
  //       this.productCategoryList.push(temp);
  //       temp = {};
  //     });
  //   }

  goToProductDetail() {
    // this.router.navigate(['/product-detail/' + + '/' + ]);
  }
  goToProductCartegory(id) {
    this.router.navigate(['/product-cartegory/' + id]);
  }

  //   async getCategoryProducts(cartegoryId, homeCategoryId) {
  //     let model = {
  //       category: cartegoryId,
  //       homeCategory: homeCategoryId
  //     }
  //     let data = await this.shopService.getCategoryProducts(model).toPromise();
  //     return data["data"];
  //   }

  //   goToCategory(id) {
  //     this.router.navigate(['/product-category/' + id]);
  //   }

}

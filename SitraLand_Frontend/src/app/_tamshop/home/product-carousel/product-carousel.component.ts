import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { MainService } from 'src/app/services/main.service';
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
    private router: Router
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
  hasProduct: boolean = false;

  allItemListEngine: any = [];
  hasProductEngine: boolean = false;

  allItemListGearbox: any = [];
  hasProductGearbox: boolean = false;
  statuseText: any;

  @Input() categoryId;

  async ngOnInit() {
    this.getCategoryProducts(this.categoryId);
    this.statuseText = this.categoryId;
  }
  async getCategoryProducts(id) {
    try {
      let data = await this.mainService.getCategory(id).toPromise();
      this.allItemList = [];
      this.allItemList = data["data"];
      if (this.allItemList['length'] > 0) {
        this.hasProduct = true;
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
    window.location['pathname'] = '/product-detail/' + id;
  }

}

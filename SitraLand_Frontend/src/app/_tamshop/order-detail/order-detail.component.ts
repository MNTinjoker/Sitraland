import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { LightboxService } from 'src/app/share/lightbox.service';
import { UtilService } from 'src/app/services/util.service';
import { MainService } from 'src/app/services/main.service';

@Component({
  standalone: false,
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private utilService: UtilService,
    private _lightbox: LightboxService,
    private mainService: MainService
  ) { }

  orderId: any;
  ordersDetail: any = [];
  ordersDetailList: any = [];
  server: string = environment.url + '/images/';
  totalPrice;
  notShow = true;
  productsIdList: any[] = [];

  async ngOnInit() {
    this.orderId = this.activeRoute.snapshot.paramMap.get('id');
    await this.getOrderDetails();
  }

  async getOrderDetails() {
    this.ordersDetail = [];
    let response = await this.mainService.getBasket(this.orderId).toPromise();
    if (response['data']) {
      this.ordersDetail = response['data'];
      let data = await this.mainService.cart(this.ordersDetail.productId).toPromise();
      this.ordersDetailList = [];
      data.forEach(element => {
        if (element && element[0]) {
          this.ordersDetailList.push(element[0]);
        }
      });
    }

    if (this.ordersDetail && this.ordersDetail['count']) {
      this.ordersDetailList.forEach((element, index) => {
        element.fldCountProduct = this.ordersDetail['count'][index];
      });
    }

    this.totalPrice = this.ordersDetail.totalPrice;
  }

  gotoOrderList() {
    this.router.navigate(['/orders-list']);
  }

}

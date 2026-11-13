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
    try {
      this.ordersDetail = [];
      const response = await this.mainService.getBasket(this.orderId).toPromise();
      if (response && response['data']) {
        this.ordersDetail = response['data'];
        const data = await this.mainService.cart(this.ordersDetail.productId).toPromise();
        this.ordersDetailList = [];
        if (Array.isArray(data)) {
          data.forEach((element: any) => {
            if (element && element[0]) {
              this.ordersDetailList.push(element[0]);
            }
          });
        }
      }

      if (this.ordersDetail && Array.isArray(this.ordersDetail['count'])) {
        this.ordersDetailList.forEach((element: any, index: number) => {
          element.fldCountProduct = this.ordersDetail['count'][index];
        });
      }

      this.totalPrice = this.ordersDetail?.totalPrice;
    } catch (error) {
      this.utilService.showNotify('خطا در دریافت اطلاعات سفارش', 'error');
    }
  }

  gotoOrderList() {
    this.router.navigate(['/admin/orders-report']);
  }

}

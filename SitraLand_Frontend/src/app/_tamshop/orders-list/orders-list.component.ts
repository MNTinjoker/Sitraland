import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MainService } from 'src/app/services/main.service';
import { UtilService } from 'src/app/services/util.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.css']
})
export class OrdersListComponent implements OnInit {

  constructor(
    private router: Router,
    private mainService: MainService,
    private utilService: UtilService
  ) { }

  ordersList: any = [];
  AllOrders: any = [];
  server: string = environment.url + '/images/';

  async ngOnInit() {
    await this.getOrders();
  }

  async getOrders() {
    this.ordersList = [];
    let response = await this.mainService.getAllBasket().toPromise();
    if (response['data'] && response['data'].length > 0) {
      this.ordersList = response['data'];
      // (this.ordersList as []).sort((a, b) => {
      //   let d1: any = new Date(a['fldCreateDateTime']);
      //   let d2: any = new Date(b['fldCreateDateTime']);
      //   return d2 - d1
      // });
      this.ordersList.forEach(element => {
        element.fullName = element.name + ' ' + element.lastName;
        element.titles = element.titles?.split(',');
        element.product = "";
        for (let i = 0; i < element.productId.length; i++) {
          element.product = element.product + element.titles[i] + ' ' + '(' + element.count[i] + ')';
        }

      });
      this.AllOrders = await this.ordersList
    }
  }

  gotoOrderDetail(orderId) {
    this.router.navigate(['/order-detail/' + orderId]);
  }

  filterOrders(id) {
    this.ordersList = this.AllOrders;
    if (id == -1) {
      return
    }
    // -1 =>all     1 => now    0 => old
    this.ordersList = this.ordersList.filter(el => el.status == id)
  }

  async sendOrderConfirm(id) {
    this.utilService.sweetAlert({ title: "آیا از ارسال سفارش  مطمئن هستید ؟", message: '' }).then(async result => {
      if (result.value) {
        try {
          await this.mainService.sendOrderConfirm(id).toPromise();
          await this.getOrders();
        } catch (error) {

        }

      }
    })
  }
}

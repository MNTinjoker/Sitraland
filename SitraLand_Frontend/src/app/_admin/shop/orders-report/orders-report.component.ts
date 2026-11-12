import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'jalali-moment';
import { Table } from 'primeng/table';
import { ShopService } from 'src/app/_services/shop.service';
import { UtilService } from 'src/app/_services/util.service';
import { TicketService } from 'src/app/ticket/ticket.service';
import swal from "sweetalert2";
@Component({
  selector: 'app-orders-report',
  templateUrl: './orders-report.component.html',
  styleUrls: ['./orders-report.component.css']
})
export class OrdersReportComponent implements OnInit {
  @ViewChild(('dt')) dt: Table;

  constructor(
    private shopService: ShopService,
    private utilService: UtilService
  ) { }
  orderslist: any = [];
  startDate: any = null;
  endDate: any = moment();
  orderId: string = null;
  merchantList: any = [];
  sellerSelected: any = null;
  userType: number;
  showProductDetailModal: boolean = false;
  productDetailList: any = [];
  titleModel: string;
  orderAddress: string;
  postalCode: string;
  statusList: any = [];
  reportStatusModal: boolean = false;
  orderIdForStatus: any;
  selectedStatus: any;
  shipmentCode: any;
  filterModel: any = { sortArray: [], inputList: [], modelList: {} }
  tableFilter: any = {};
  filterConst: any;

  async ngOnInit() {
    this.userType = this.utilService.checkUserType();
    if (this.userType == 1 || this.userType == 28) {
      this.getMerchants();
    }
    await this.getStatus();
    await this.getFilterTable();
  }

  async getMerchants() {
    let data = await this.shopService.getMerchants().toPromise();
    this.merchantList = data['data'];
    let all = {
      fldNameSellers: 'همه',
      fldPkSellers: -1
    }
    this.merchantList.unshift(all);
    this.merchantList.forEach(element => {
      element.id = element.fldPkSellers;
      element.text = element.fldNameSellers;
    });
  }

  async getOrders() {
    this.orderslist = [];
    if (!this.startDate) {
      this.utilService.showNotify('لطفا تاریخ شروع را وارد کنید', "error");
      return;
    }
    if (this.sellerSelected == -1) {
      this.sellerSelected = null;
    }
    try {
      let data;
      if (this.userType == 1 || this.userType == 28) {

        let model = {
          startDate: this.startDate._d,
          endDate: this.endDate._d,
          merchantId: +this.sellerSelected || null,
          orderId: +this.orderId || null
        }

        this.filterModel['modelList'] = model;
        data = await this.shopService.ordersReport(model).toPromise();
      }
      else {

        let model = {
          startDate: this.startDate._d,
          endDate: this.endDate._d,
          orderId: +this.orderId || null
        }

        this.filterModel['modelList'] = model;
        data = await this.shopService.getMerchantOrders(model).toPromise();
      }
      this.orderslist = data['data'];
      this.orderslist.forEach(element => {
        element.fullName = element.fldFirstName + ' ' + element.fldLastName
      });
      (this.orderslist as []).sort((a, b) => {
        let d1: any = new Date(a['fldCreateDateTime']);
        let d2: any = new Date(b['fldCreateDateTime']);
        return d2 - d1
      })

    } catch (error) {
      this.utilService.showNotify('خطا در دریافت اطلاعات', "error");
    }
  }


  async ProductDetailModal(order) {
    try {
      this.titleModel = '';
      this.orderAddress = order['fullAddress'];
      this.postalCode = order['fldPostalCode'];
      let data = await this.shopService.orderReportDetail(order.fldPkOrderCo).toPromise();
      this.productDetailList = data['data'];
      this.titleModel = "جزئیات سفارش " + " " + data['data'][0]['customerName'];
      this.showProductDetailModal = true;
    } catch (error) {
      this.utilService.showNotify('خطا در دریافت اطلاعات', "error");
    }
  }

  async getStatus() {
    this.statusList = [];
    let data = await this.shopService.getStatus().toPromise();
    if (data['data'] && data['data'].length > 0)
      this.statusList = data['data'];
    let all = {
      fldTitleStatus: 'همه',
      fldPkStatus: ''
    }
    this.statusList.unshift(all);
    this.statusList.forEach(element => {
      element.id = element.fldPkStatus;
      element.text = element.fldTitleStatus;
    });
    console.log(this.statusList);

  }

  showreportStatusModal(order) {
    this.shipmentCode = "";
    this.orderIdForStatus = order['fldPkOrderCo'];
    this.reportStatusModal = true;
    this.shipmentCode = null;
    this.selectedStatus = null;

  }

  goToProductDetail(item) {
    localStorage.setItem('totalPrice', item.fldFinalPrice);
    localStorage.setItem('fromAdmin', '0');

    localStorage.setItem('ordersFilter', this.utilService.encryptData(this.filterModel));

    window.open(`/order-detail-admin/${item.fldPkOrderCo}`);
  }
  async saveOrderStatus() {
    if (!this.selectedStatus) {
      this.utilService.showNotify('وضعیت را انتخاب کنید ', "error");
      return
    }
    if (this.selectedStatus == 8 && (!this.shipmentCode || this.shipmentCode.length != 24)) {
      this.utilService.showNotify('کد مرسوله را به درستی وارد کنید', "error");
      return

    }
    let data = {
      id: this.orderIdForStatus,
      status: this.selectedStatus,
      postTrackingId: this.shipmentCode ? this.shipmentCode : ''
    }
    this.utilService.sweetAlert({
      message: " از ذخیره این وضعیت اطمینان دارید ؟ "
    }).then(async check => {
      if (check.value) {
        let response = await this.shopService.saveOrderStatus(data).toPromise();
        if (response['data'][0]['status'] == 0) {
          this.utilService.showNotify('با موفقیت انجام شد', "success");
          this.shipmentCode = null;
        }
        if (response['data'][0]['status'] != 0) {
          this.utilService.showNotify('خطا در ذخیره اطلاعات', "error");
        }
        this.reportStatusModal = false;
        this.selectedStatus = null;

        await this.getOrders();
      }
    })
  }
  momentFormat(date, hasTime) {
    if (!date)
      return null
    const idate = moment(date);
    const jalaliDate = idate.format('jYYYY/jMM/jDD HH:mm:ss')
    const res = hasTime ? moment(jalaliDate, 'jYYYY/jMM/jDD HH:mm:ss') : moment(jalaliDate, 'jYYYY/jMM/jDD');
    return res;
  }
  async getFilterTable() {
    let userFilter = this.utilService.decryptData(localStorage.getItem('ordersFilter'));
    this.filterModel.inputList = (userFilter?.inputList && userFilter['inputList'].length > 0) ? userFilter['inputList'] : [];
    this.filterModel.sortArray = (userFilter?.sortArray && userFilter['sortArray'].length > 0) ? userFilter['sortArray'] : [];
    if (userFilter?.modelList) {
      this.orderId = userFilter.modelList.orderId;
      this.sellerSelected = userFilter.modelList.merchantId ? userFilter.modelList.merchantId : null;
      this.startDate = userFilter.modelList['startDate'] ? this.momentFormat(userFilter.modelList['startDate'], true) : null;
      this.endDate = userFilter.modelList['endDate'] ? this.momentFormat(userFilter.modelList['endDate'], true) : null;
      const { field } = this.filterModel['sortArray']
      this.filterConst = field != undefined ? this.filterModel['sortArray'] : null;
      await this.getOrders();
    }


    setTimeout(() => {
      userFilter?.inputList.forEach(element => {
        this.dt.filter(element.value, element.name, element.condition);
        this.tableFilter[element.name] = element.value
      });

    }, 1000);
  }
  saveTableFilter(value, field, condition) {
    // filterList = { sortArray: [], inputList: [], modelList: [] };
    if (field == null && condition == null) {
      let isExist = this.filterModel['sortArray'].filter(item => item.field == value);
      if (isExist.length >= 1) {
        this.filterModel['sortArray'].forEach(item => {
          if (item.field == value) {
            switch (item.order) {
              case -1:
                item.order = 1
                break;
              case 1:
                item.order = -1
                break;
            }
          }
        });
      } else {
        this.filterModel['sortArray'] = []
        this.filterModel['sortArray'].push({ field: value, order: -1 })
      }
    } else {
      let isExist = this.filterModel['inputList'].filter(item => item.name == field);
      if (isExist.length >= 1) {
        this.filterModel['inputList'].forEach(element => {
          if (element.name == field) {
            element.value = value
          }
        });
      } else {
        this.filterModel['inputList'].push({ name: field, value: value, condition: condition })
      }
    }
  }


}
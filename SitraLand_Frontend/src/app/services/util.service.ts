import { NotifierService } from 'angular-notifier';
import { Injectable } from '@angular/core';
import swal from "sweetalert2";
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MainService } from './main.service';
import * as moment from 'jalali-moment';
import { Location } from '@angular/common';

declare const $: any;
declare var require: any


@Injectable({
  providedIn: 'root'
})

export class UtilService {
  url = environment.url;
  CryptoJS = require("crypto-js");


  encryptSecretKey = "allmenmustdie"
  constructor(
    private http: HttpClient,
    private mainService: MainService,
    notifier: NotifierService,
    private location: Location
  ) { this.notifier = notifier; }
  stdMobile;
  notifier


  showNotify(message, type) {
    this.notifier.notify(type, message);
  }

  getBase64(file) {
    if (!file) {
      return new Promise((resolve, reject) => {
        resolve('');
      });
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result);
      };
    });
  }

  encryptData(data) {
    try {
      return this.CryptoJS.AES.encrypt(JSON.stringify(data), this.encryptSecretKey).toString();
    } catch (e) {
    }
  }

  decryptData(data) {
    try {
      const bytes = this.CryptoJS.AES.decrypt(data, this.encryptSecretKey);
      if (bytes.toString()) {
        return JSON.parse(bytes.toString(this.CryptoJS.enc.Utf8));
      }
      return data;
    } catch (e) {
    }
  }

  checkBasketNumber(orders) {
    // let orders = localStorage.getItem('info');

    let products = localStorage.getItem('products');
    let preOrder = {
      orders: []
    }
    // if (orders) {
    //   preOrder = this.decryptData(orders);
    // }
    let prods = {
      orders: []
    }
    if (products) {
      prods = this.decryptData(products);
    }

    if (orders) {
      this.checkBlinker(preOrder, orders);
    } else {
      this.checkBlinker(prods, 0);
    }
  }

  checkBlinker(items, count) {
    let len = items.orders.length > 0 ? items.orders.length : count;
    if (len > 0) {
      $(".basket-num").attr('data-content', len);
      document.getElementsByClassName('basket-num')[0]['children'][0].classList.add('iconboxBlinker');
    } else {
      $(".basket-num").attr('data-content', '');
      document.getElementsByClassName('basket-num')[0]['children'][0].classList.remove('iconboxBlinker');
    }
  }


  checkUserLogin() {
    let secret = localStorage.getItem('secret');
    let token = localStorage.getItem('token');
    if (secret && token) {
      return true;
    }
    return false
  }

  sweetAlert(config) {
    let alert: any = (swal as any).mixin({
      customClass: {
        confirmButton: "btn btn-success ml-1",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });
    return alert
      .fire({
        title: config['title'],
        html: config['message'],
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "بله انجام بده",
        cancelButtonText: "منصرف شدم",
        reverseButtons: false,
      })
  }

  sweetAlertNoConfirm(message) {
    const Swal: any = (swal as any)
    Swal.fire({
      title: message,
      text: '',
      confirmButtonText: 'باشه',
    })
  }

  sweetAlertSuccess(message) {
    const Swal: any = (swal as any)
    Swal.fire({
      timer: 3000,
      title: message,
      type: "success",
      showConfirmButton: false
    })
  }

  checkEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  checkMobile(mobile) {
    if (mobile.length !== 11)
      return false;
    if (!mobile.startsWith("09"))
      return false;
    return true;

  }


  momentFormat(date, hasTime) {
    if (!date)
      return null
    const idate = moment(date + 'Z');
    const jalaliDate = idate.format('jYYYY/jMM/jDD HH:mm:ss')
    const res = hasTime ? moment(jalaliDate, 'jYYYY/jMM/jDD HH:mm:ss') : moment(jalaliDate, 'jYYYY/jMM/jDD');
    return res;
  }


  getProvider() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.get('https://ipapi.co/json/', httpOptions);
  }

  goBack() {
    this.location.back();
  }
}

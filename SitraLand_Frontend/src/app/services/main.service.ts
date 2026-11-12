import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { NotifierService } from 'angular-notifier';

@Injectable({
  providedIn: 'root'
})
export class MainService {
  CryptoJS: any;
  data: any;
  constructor(
    private http: HttpClient,
    notifier: NotifierService,

  ) {
    this.notifier = notifier;
  }
  notifier: any;
  url = environment.url;


  showNotify(message: string, type: string) {
    this.notifier.notify(type, message);
  }


  // with Authorization
  apiName() {
    let token = localStorage.getItem("token");
    const uri = this.url + "api/user/apiName";
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      }),
    };
    return this.http.get<any>(uri, httpOptions);
  }

  // without Authorization
  apiName2() {
    const uri = this.url + "api/user/apiName2";
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      }),
    };
    return this.http.get<any>(uri, httpOptions);
  }

  //side admin product-config
  // Account

  signUp(data) {
    const uri = this.url + "/api/account/signUp";
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      }),
    };
    return this.http.post(uri, data, httpOptions);
  }
  
  login(data) {
    const uri = this.url + "/api/account/login";
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      }),
    };
    return this.http.post(uri, data, httpOptions);
  }  
  
  getRoles() {
    const uri = this.url + "/api/account/getRoles";
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      }),
    };
    return this.http.get(uri, httpOptions);
  } 
  
  GetRoleBasedUsers(role) {
    const uri = this.url + "/api/account/GetRoleBasedUsers/" + role;
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      }),
    };
    return this.http.get(uri, httpOptions);
  }
  addRoleToUser(data) {
    const uri = this.url + "/api/account/addRoleToUser";
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      }),
    };
    return this.http.post(uri, data, httpOptions);
  } 
  
  saveProduct(data) {
    const uri = this.url + "/api/products/saveProduct";
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      }),
    };
    return this.http.post(uri, data, httpOptions);
  }

  getHomeCategory() {
    let token = localStorage.getItem("token");
    const uri = this.url + "api/user/getHomeCategory";
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      }),
    };
    return this.http.get<any>(uri, httpOptions);
  }

  getCategories() {
    const uri = this.url + "/api/products/getCategories";
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      }),
    };
    return this.http.get<any>(uri, httpOptions);
  }

  getProducts() {
    const uri = this.url + "/api/products/getProducts";
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      }),
    };
    return this.http.get<any>(uri, httpOptions);
  }

  deleteProduct(productId: any) {
    const uri = this.url + "/api/products/deleteProduct/" + productId;
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      }),
    };
    return this.http.get<any>(uri, httpOptions);
  }

  getCategory(categoryId: any) {
    const uri = this.url + "/api/products/getCategory/" + categoryId;
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      }),
    };
    return this.http.get<any>(uri, httpOptions);
  }


  getProductImage(productId: any) {
    let token = localStorage.getItem("token");
    const uri = this.url + "api/user/getProductImage" + productId;
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      }),
    };
    return this.http.get<any>(uri, httpOptions);
  }



  saveProductImage(data: any) {
    let token = localStorage.getItem('token');
    const uri = this.url + "api/user/saveProductImage";
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      }),
    };
    return this.http.post(uri, data, httpOptions);
  }

  //product-detail
  saveProductDetail(data: any) {
    let token = localStorage.getItem('token');
    const uri = this.url + "api/user/saveProductDetail";
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      }),
    };
    return this.http.post(uri, data, httpOptions);
  }

  saveProducts(data: any) {
    let uri = this.url + 'api/learn/saveExamAnswer';
    let token = localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      })
    }
    return this.http.post(uri, data, httpOptions);
  }

  getProductDetail(productId: any) {
    let token = localStorage.getItem("token");
    const uri = this.url + "api/user/getProductDetail" + productId;
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      }),
    };
    return this.http.get<any>(uri, httpOptions);
  }


  getProduct(productId: any) {
    let token = localStorage.getItem("token");
    const uri = this.url + "/api/products/getProduct/" + productId;
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      }),
    };
    return this.http.get<any>(uri, httpOptions);
  }

  getBasket(basketCode: any) {
    let token = localStorage.getItem("token");
    const uri = this.url + "/api/basket/getBasket/" + basketCode;
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      }),
    };
    return this.http.get<any>(uri, httpOptions);
  }

  cart(productIds: any) {
    const uri = this.url + "/api/basket/getBasketProducts";
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };
    return this.http.post<any>(uri, productIds, httpOptions);
  }

  saveOrder(data: any) {
    let uri = this.url + '/api/basket/saveBasket';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    }
    return this.http.post(uri, data, httpOptions);
  }

  getAllBasket() {
    let uri = this.url + '/api/basket/getAllBasket';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    }
    return this.http.get(uri, httpOptions);
  }

  sendOrderConfirm(id) {
    let uri = this.url + '/api/basket/sendOrderConfirm/' + id;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    }
    return this.http.get(uri, httpOptions);
  }

  decryptData(data: string | null) {
    try {
      const bytes = this.CryptoJS.AES.decrypt(data, this.encryptSecretKey);
      if (bytes.toString()) {
        return JSON.parse(bytes.toString(this.CryptoJS.enc.Utf8));
      }
      return data;
    } catch (e) {
    }
  }

  encryptSecretKey(data: string | null, encryptSecretKey: any) {
    throw new Error('Method not implemented.');
  }

  encryptData(data: any) {
    try {
      return this.CryptoJS.AES.encrypt(JSON.stringify(data), this.encryptSecretKey).toString();
    } catch (e) {
    }
  }

}

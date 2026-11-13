import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { NotifierService } from 'angular-notifier';

@Injectable({
  providedIn: 'root'
})
export class MainService {
  constructor(
    private http: HttpClient,
    notifier: NotifierService,

  ) {
    this.notifier = notifier;
  }
  notifier: any;
  url = environment.url;

  private jsonHeaders = {
    headers: new HttpHeaders({
      "Content-Type": "application/json"
    })
  };

  showNotify(message: string, type: string) {
    this.notifier.notify(type, message);
  }

  // Account
  signUp(data) {
    const uri = this.url + "/api/account/signUp";
    return this.http.post(uri, data, this.jsonHeaders);
  }

  login(data) {
    const uri = this.url + "/api/account/login";
    return this.http.post(uri, data, this.jsonHeaders);
  }

  getRoles() {
    const uri = this.url + "/api/account/getRoles";
    return this.http.get(uri, this.jsonHeaders);
  }

  GetRoleBasedUsers(role) {
    const uri = this.url + "/api/account/GetRoleBasedUsers/" + role;
    return this.http.get(uri, this.jsonHeaders);
  }

  addRoleToUser(data) {
    const uri = this.url + "/api/account/addRoleToUser";
    return this.http.post(uri, data, this.jsonHeaders);
  }

  // Products
  saveProduct(data) {
    const uri = this.url + "/api/products/saveProduct";
    return this.http.post(uri, data, this.jsonHeaders);
  }

  getCategories() {
    const uri = this.url + "/api/products/getCategories";
    return this.http.get<any>(uri, this.jsonHeaders);
  }

  getProducts(page: number = 1, pageSize: number = 10, search?: string, sortField?: string, sortOrder?: string) {
    const uri = this.url + "/api/products/getProducts";
    let params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize);
    if (search) {
      params = params.set('search', search);
    }
    if (sortField) {
      params = params.set('sortField', sortField);
      params = params.set('sortOrder', sortOrder === '-1' ? 'desc' : 'asc');
    }
    return this.http.get<any>(uri, { ...this.jsonHeaders, params });
  }

  deleteProduct(productId: any) {
    const uri = this.url + "/api/products/deleteProduct/" + productId;
    return this.http.delete<any>(uri, this.jsonHeaders);
  }

  getCategory(categoryId: any, page: number = 1, pageSize: number = 16, search?: string) {
    const uri = this.url + "/api/products/getCategory/" + categoryId;
    let params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize);
    if (search) {
      params = params.set('search', search);
    }
    return this.http.get<any>(uri, { params, ...this.jsonHeaders });
  }

  getProduct(productId: any) {
    const uri = this.url + "/api/products/getProduct/" + productId;
    return this.http.get<any>(uri, this.jsonHeaders);
  }

  getProductGallery(productId: any) {
    const uri = this.url + "/api/products/getProductGallery/" + productId;
    return this.http.get<any>(uri, this.jsonHeaders);
  }

  saveProductGallery(data: any) {
    const uri = this.url + "/api/products/saveProductGallery";
    return this.http.post(uri, data, this.jsonHeaders);
  }

  // Basket / orders
  getBasket(basketCode: any) {
    const uri = this.url + "/api/basket/getBasket/" + basketCode;
    return this.http.get<any>(uri, this.jsonHeaders);
  }

  cart(productIds: any) {
    const uri = this.url + "/api/basket/getBasketProducts";
    return this.http.post<any>(uri, productIds, this.jsonHeaders);
  }

  saveOrder(data: any) {
    const uri = this.url + '/api/basket/saveBasket';
    return this.http.post(uri, data, this.jsonHeaders);
  }

  getAllBasket(page: number = 1, pageSize: number = 10, status?: number, search?: string) {
    const uri = this.url + '/api/basket/getAllBasket';
    let params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize);
    if (status !== undefined && status !== null && status > -1) {
      params = params.set('status', status);
    }
    if (search) {
      params = params.set('search', search);
    }
    return this.http.get(uri, { ...this.jsonHeaders, params });
  }

  sendOrderConfirm(id) {
    const uri = this.url + '/api/basket/sendOrderConfirm/' + id;
    return this.http.post(uri, {}, this.jsonHeaders);
  }
}

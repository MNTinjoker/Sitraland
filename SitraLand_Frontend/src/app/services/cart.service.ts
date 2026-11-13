import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UtilService } from './util.service';

export interface CartOrder {
  id: number;
  Number: number;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly storageKey = 'products';
  private readonly countSubject = new BehaviorSubject<number>(0);
  readonly count$ = this.countSubject.asObservable();

  constructor(private utilService: UtilService) {
    this.refreshCount();
  }

  getCount(): number {
    return this.countSubject.value;
  }

  private readOrders(): CartOrder[] {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) {
        return [];
      }

      const data = this.utilService.decryptData(raw);
      if (!data || !Array.isArray(data.orders)) {
        return [];
      }

      return data.orders;
    } catch {
      return [];
    }
  }

  private writeOrders(orders: CartOrder[]): void {
    if (!orders || orders.length === 0) {
      localStorage.removeItem(this.storageKey);
      this.countSubject.next(0);
      return;
    }

    localStorage.setItem(this.storageKey, this.utilService.encryptData({ orders }));
    this.countSubject.next(orders.length);
  }

  refreshCount(): void {
    this.countSubject.next(this.readOrders().length);
  }

  getOrders(): CartOrder[] {
    return this.readOrders();
  }

  addProduct(id: number, quantity: number = 1): void {
    const orders = this.readOrders();
    const index = orders.findIndex(x => x.id == id);

    if (index !== -1) {
      orders[index]['Number'] = (Number(orders[index]['Number']) || 0) + quantity;
    } else {
      orders.push({ id, Number: quantity });
    }

    this.writeOrders(orders);
  }

  removeProduct(id: number): void {
    const orders = this.readOrders().filter(x => x.id != id);
    this.writeOrders(orders);
  }

  setOrders(orders: CartOrder[]): void {
    this.writeOrders(Array.isArray(orders) ? orders : []);
  }

  clear(): void {
    this.writeOrders([]);
  }
}

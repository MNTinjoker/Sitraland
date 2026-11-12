import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckoutShopComponent } from './checkout-shop.component';

const routes: Routes = [{ path: '', component: CheckoutShopComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CheckoutShopRoutingModule { }

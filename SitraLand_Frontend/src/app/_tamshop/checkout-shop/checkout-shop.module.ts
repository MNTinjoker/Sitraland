import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutShopRoutingModule } from './checkout-shop-routing.module';
import { CheckoutShopComponent } from './checkout-shop.component';
import { FormsModule } from '@angular/forms';
import { ShareModule } from 'src/app/share/share.module';


@NgModule({
  declarations: [
    CheckoutShopComponent,
  ],
  imports: [
    CommonModule,
    CheckoutShopRoutingModule,
    FormsModule,
    ShareModule,
   
  ]
})
export class CheckoutShopModule { }

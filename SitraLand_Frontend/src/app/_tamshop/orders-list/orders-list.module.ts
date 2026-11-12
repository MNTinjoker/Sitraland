import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersListRoutingModule } from './orders-list-routing.module';
import { OrdersListComponent } from './orders-list.component';

import { FormsModule } from '@angular/forms';
import { ShareModule } from 'src/app/share/share.module';
import { TooltipModule } from 'primeng/tooltip';
@NgModule({
  declarations: [
    OrdersListComponent
  ],
  imports: [
    CommonModule,
    OrdersListRoutingModule,
    FormsModule,
    ShareModule,
    TooltipModule
  ]
})
export class OrdersListModule { }

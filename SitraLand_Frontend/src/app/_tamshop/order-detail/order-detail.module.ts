import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderDetailRoutingModule } from './order-detail-routing.module';
import { OrderDetailComponent } from './order-detail.component';

import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { ShareModule } from 'src/app/share/share.module';

@NgModule({
  declarations: [
    OrderDetailComponent
  ],
  imports: [
    CommonModule,
    OrderDetailRoutingModule,
    FormsModule,
    ShareModule,
    TooltipModule
  ]
})
export class OrderDetailModule { }

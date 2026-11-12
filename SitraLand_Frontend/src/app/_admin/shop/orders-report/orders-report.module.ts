import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersReportRoutingModule } from './orders-report-routing.module';
import { OrdersReportComponent } from './orders-report.component';
import { FormsModule } from '@angular/forms';
// import { ShareModule } from 'src/app/share/share.module';
import { TableModule } from 'primeng/table';


@NgModule({
  declarations: [
    OrdersReportComponent
  ],
  imports: [
    CommonModule,
    OrdersReportRoutingModule,
    FormsModule,
    TableModule
  ]
})
export class OrdersReportModule { }

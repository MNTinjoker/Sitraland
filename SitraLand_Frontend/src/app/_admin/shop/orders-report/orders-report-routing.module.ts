import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrdersReportComponent } from './orders-report.component';

const routes: Routes = [{ path: '', component: OrdersReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersReportRoutingModule { }

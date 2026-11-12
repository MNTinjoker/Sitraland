import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductListRoutingModule } from './product-list-routing.module';
import { ProductListComponent } from './product-list.component';
import { FormsModule } from '@angular/forms';
import { ShareModule } from 'src/app/share/share.module';
import { TableModule } from 'primeng/table';

@NgModule({
  declarations: [
    ProductListComponent
  ],
  imports: [
    CommonModule,
    ProductListRoutingModule,
    FormsModule,
    ShareModule,
    TableModule
  ]
})
export class ProductListModule { }

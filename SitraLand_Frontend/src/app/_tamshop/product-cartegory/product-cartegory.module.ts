import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductCartegoryRoutingModule } from './product-cartegory-routing.module';
import { ProductCartegoryComponent } from './product-cartegory.component';
import { DataViewModule } from 'primeng/dataview';
import { ShareModule } from 'src/app/share/share.module';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
  declarations: [
    ProductCartegoryComponent
  ],
  imports: [
    CommonModule,
    ProductCartegoryRoutingModule,
    ShareModule,
    FormsModule,
    DropdownModule,
    DataViewModule
  ]
})
export class ProductCartegoryModule { }

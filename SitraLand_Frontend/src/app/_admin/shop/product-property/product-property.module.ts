import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductPropertyRoutingModule } from './product-property-routing.module';
import { ProductPropertyComponent } from './product-property.component';
import { FormsModule } from '@angular/forms';
import { ShareModule } from 'src/app/share/share.module';


@NgModule({
  declarations: [
    ProductPropertyComponent
  ],
  imports: [
    CommonModule,
    ProductPropertyRoutingModule,
    FormsModule,
    ShareModule
  ]
})
export class ProductPropertyModule { }

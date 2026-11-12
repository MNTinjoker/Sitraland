import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BarcodeRoutingModule } from './barcode-routing.module';
import { BarcodeComponent } from './barcode.component';


@NgModule({
  declarations: [
    BarcodeComponent
  ],
  imports: [
    CommonModule,
    BarcodeRoutingModule
  ]
})
export class BarcodeModule { }

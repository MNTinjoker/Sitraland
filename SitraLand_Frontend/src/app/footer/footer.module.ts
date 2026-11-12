import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../share/share.module';
import { FooterRoutingModule } from './footer-routing.module';
import { FooterComponent } from './footer.component';
import { GMapModule } from 'primeng/gmap';



@NgModule({
  declarations: [
    FooterComponent
  ],
  imports: [
    CommonModule,
    FooterRoutingModule,
    ShareModule,
    GMapModule,

  ],
  exports: [FooterComponent]
})
export class FooterModule { }

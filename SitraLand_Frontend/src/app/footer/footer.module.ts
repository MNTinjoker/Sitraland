import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../share/share.module';
import { FooterRoutingModule } from './footer-routing.module';
import { FooterComponent } from './footer.component';



@NgModule({
  declarations: [
    FooterComponent
  ],
  imports: [
    CommonModule,
    FooterRoutingModule,
    ShareModule,

  ],
  exports: [FooterComponent]
})
export class FooterModule { }

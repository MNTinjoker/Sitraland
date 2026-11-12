import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductCarouselRoutingModule } from './product-carousel-routing.module';
import { ProductCarouselComponent } from './product-carousel.component';
import { CarouselModule } from 'primeng/carousel';
import { ShareModule } from 'src/app/share/share.module';


@NgModule({
  declarations: [
    ProductCarouselComponent
  ],
  imports: [
    CommonModule,
    ProductCarouselRoutingModule,
    CarouselModule,
    ShareModule
  ],
  exports : [ProductCarouselComponent]
})
export class ProductCarouselModule { }

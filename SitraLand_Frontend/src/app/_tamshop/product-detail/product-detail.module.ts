import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductDetailRoutingModule } from './product-detail-routing.module';
import { ProductDetailComponent } from './product-detail.component';
import { ShareModule } from 'src/app/share/share.module';
import { FormsModule } from '@angular/forms';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { GalleriaModule } from 'primeng/galleria';
import { ProductCarouselModule } from '../home/product-carousel/product-carousel.module';

@NgModule({
  declarations: [
    ProductDetailComponent
  ],
  imports: [
    CommonModule,
    ProductDetailRoutingModule,
    FormsModule,
    ShareModule,
    CarouselModule,
    GalleriaModule,
    ProductCarouselModule
  ]
})
export class ProductDetailModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { homeRoutingModule } from './home-routing.module';
import { homeComponent } from './home.component';
import { FormsModule } from '@angular/forms';
import { ShareModule } from 'src/app/share/share.module';
import { ProductCarouselModule } from './product-carousel/product-carousel.module';


@NgModule({
  declarations: [
    homeComponent,
  ],
  imports: [
    CommonModule,
    homeRoutingModule,
    FormsModule,
    ShareModule,
    ProductCarouselModule
  ]
})
export class homeModule { }

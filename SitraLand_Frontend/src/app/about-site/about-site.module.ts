import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AboutSiteRoutingModule } from './about-site-routing.module';
import { AboutSiteComponent } from './about-site.component';
import { FooterModule } from '../footer/footer.module';


@NgModule({
  declarations: [
    AboutSiteComponent
  ],
  imports: [
    CommonModule,
    AboutSiteRoutingModule,
    FormsModule,
    FooterModule
  ],
})
export class AboutSiteModule { }

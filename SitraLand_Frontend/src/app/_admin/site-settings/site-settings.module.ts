import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShareModule } from 'src/app/share/share.module';

import { SiteSettingsRoutingModule } from './site-settings-routing.module';
import { SiteSettingsComponent } from './site-settings.component';

@NgModule({
  declarations: [
    SiteSettingsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ShareModule,
    SiteSettingsRoutingModule
  ]
})
export class SiteSettingsModule { }

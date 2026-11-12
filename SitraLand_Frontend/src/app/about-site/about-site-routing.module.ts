import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutSiteComponent } from './about-site.component';

const routes: Routes = [{ path: '', component: AboutSiteComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AboutSiteRoutingModule { }

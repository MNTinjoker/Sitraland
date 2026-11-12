import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductPropertyComponent } from './product-property.component';

const routes: Routes = [{ path: '', component: ProductPropertyComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductPropertyRoutingModule { }

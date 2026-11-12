import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductCartegoryComponent } from './product-cartegory.component';

const routes: Routes = [{ path: '', component: ProductCartegoryComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductCartegoryRoutingModule { }

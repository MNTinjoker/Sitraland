import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserManagmentComponent } from './user-managment.component';

const routes: Routes = [{ path: '', component: UserManagmentComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserManagmentRoutingModule { }

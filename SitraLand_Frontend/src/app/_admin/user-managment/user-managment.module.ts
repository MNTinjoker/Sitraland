import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserManagmentRoutingModule } from './user-managment-routing.module';
import { UserManagmentComponent } from './user-managment.component';
import { FormsModule } from '@angular/forms';
import { ShareModule } from '../../share/share.module';


@NgModule({
  declarations: [UserManagmentComponent],
  imports: [
    CommonModule,
    UserManagmentRoutingModule,
    FormsModule,
    ShareModule
  ]
})
export class UserManagmentModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserManagmentRoutingModule } from './user-managment-routing.module';
import { UserManagmentComponent } from './user-managment.component';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { HttpClientModule } from '@angular/common/http';
import { DropdownModule } from 'primeng/dropdown';

import { NgxDropzoneModule } from 'ngx-dropzone';
import { ShareModule } from '../../share/share.module';


@NgModule({
  declarations: [UserManagmentComponent],
  imports: [
    CommonModule,
    UserManagmentRoutingModule,
    FormsModule,
    NgxDropzoneModule,
    TableModule,
    HttpClientModule,
    DropdownModule,
    ShareModule
  ]
})
export class UserManagmentModule { }

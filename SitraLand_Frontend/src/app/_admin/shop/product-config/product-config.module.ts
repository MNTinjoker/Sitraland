import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelect2Module } from 'ng-select2';
import { ProductConfigRoutingModule } from './product-config-routing.module';
import { ProductConfigComponent } from './product-config.component';
import { FormsModule } from '@angular/forms';
import { ShareModule } from 'src/app/share/share.module';
import { DialogModule } from 'primeng/dialog';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';



@NgModule({
  declarations: [
    ProductConfigComponent
  ],
  imports: [
    CommonModule,
    ProductConfigRoutingModule,
    FormsModule,
    DialogModule,
    NgxDropzoneModule,
    NgSelect2Module,
    ShareModule,
    CKEditorModule
  ]
})
export class ProductConfigModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumberSplitPipe, ShamsiDatePipe, inputNumberSplitPipe } from './custom.pipe';
import { ImageFallbackDirective } from './image-fallback.directive';
import { TableModule } from 'primeng/table';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DialogModule } from 'primeng/dialog';

@NgModule({
  declarations: [
    NumberSplitPipe,
    ShamsiDatePipe,
    inputNumberSplitPipe,
    ImageFallbackDirective
  ],
  imports: [
    CommonModule,
    TableModule
  ],
  exports: [
    NumberSplitPipe,
    ShamsiDatePipe,
    inputNumberSplitPipe,
    ImageFallbackDirective,
    TableModule,
    RadioButtonModule,
    NgxDropzoneModule,
    SelectModule,
    DialogModule

  ]
})
export class ShareModule { }

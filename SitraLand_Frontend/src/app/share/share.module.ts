import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumberSplitPipe, ShamsiDatePipe, inputNumberSplitPipe } from './custom.pipe';
import { TableModule } from 'primeng/table';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DialogModule } from 'primeng/dialog';

@NgModule({
  declarations: [
    NumberSplitPipe,
    ShamsiDatePipe,
    inputNumberSplitPipe
  ],
  imports: [
    CommonModule,
    TableModule
  ],
  exports: [
    NumberSplitPipe,
    ShamsiDatePipe,
    inputNumberSplitPipe,
    TableModule,
    RadioButtonModule,
    InputSwitchModule,
    NgxDropzoneModule,
    DropdownModule,
    DialogModule

  ]
})
export class ShareModule { }

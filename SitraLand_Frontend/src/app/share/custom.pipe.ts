import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'jalali-moment';


@Pipe({ name: 'NumberSplit' })
export class NumberSplitPipe implements PipeTransform {
  transform(value: any) {
    if (!value)
      return;
    return (value / 10).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }
}

@Pipe({ name: 'inputNumberSplit' })
export class inputNumberSplitPipe implements PipeTransform {
  transform(value: any) {
    if (!value)
      return;
    return (value).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }
}


@Pipe({ name: 'CustomTime' })
export class CustomTimePipe implements PipeTransform {
  transform(value: any) {
    if (!value)
      return 0
    const floor = Math.floor(value);
    const h = Math.floor(floor / 3600)
    const m = Math.floor((floor - h * 3600) / 60);
    const s = Math.floor((floor - h * 3600) % 60);

    return h + ":" + m + ":" + s;
  }
}

@Pipe({ name: 'ShamsiDate' })
export class ShamsiDatePipe implements PipeTransform {
  transform(value: any) {
    if (!value) {
      return '';
    }
    let date = moment(value).format('jYYYY/jMM/jDD');
    return date;
  }
}

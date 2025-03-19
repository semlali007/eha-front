import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'filterCode' })
export class FilterCodePipe implements PipeTransform {
  transform(value: any, input: any): any {
    if (input) {
      return value.filter(val => val[0].indexOf(input) >= 0);
    } else {
      return value;
    }
  }
}
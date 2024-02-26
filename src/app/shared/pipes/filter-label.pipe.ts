import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'filterLabel' })
export class FilterLabelPipe implements PipeTransform {
  transform(value: any, input: any): any {
    if (input) {
      return value.filter((item: any) => item[1].toLowerCase().indexOf(input.toLowerCase()) !== -1);
    } else {
      return value;
    }
  }
}

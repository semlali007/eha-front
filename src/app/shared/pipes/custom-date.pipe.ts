import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'customDate'
})
export class CustomDatePipe extends
  DatePipe implements PipeTransform {
  transform(value: any, args?: any): any {
    if(!args){
      return super.transform(value,'dd/MM/yyyy') ;
    }
    return super.transform(value, args);
  }
}
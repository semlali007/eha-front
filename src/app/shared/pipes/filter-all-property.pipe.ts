import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'filterAllProperty' })
export class FilterAllPropertyPipe implements PipeTransform {
  transform(list, input: string, args: Array<string>): any {

    if (input) {
      let lowerInput = input.toLowerCase();
      return list.filter(
        val => {
          for (let arg of args) {
            if (val[arg].toLowerCase().indexOf(lowerInput) >= 0)
              return true;
          }
          return false;
        }
      );
    } else {
      return list;
    }
  }
}
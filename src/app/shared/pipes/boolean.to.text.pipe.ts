import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'showBooleanText' })
export class BooleanToTextPipe implements PipeTransform {
  transform(bool: boolean): string {
    let text: string;
    switch (true) {
      case bool == true:
        text = 'Oui';
        break;
      case bool == false:
        text = 'Non';
        break;
      default:
        text = `${bool}`;
        break;
    }
    return text;
  }
}
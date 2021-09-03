import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'sheetStatusColor' })
export class SheetStatusColorPipe implements PipeTransform {
  transform(statusCode: string): string {
    let color: string;
    switch (true) {
      case statusCode == '-1':
        color = 'secondary';
        break;
      case statusCode == '0':
        color = 'warning';
        break;
      case statusCode == '1':
        color = 'success';
        break;
      default:
        color = 'warning';
        break;
    }
    return 'badge-' + color;
  }
}
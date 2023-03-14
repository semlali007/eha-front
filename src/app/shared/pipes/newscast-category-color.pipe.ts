import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'newsCastCategoryColor' })
export class NewsCastCategoryColor implements PipeTransform {
  transform(statusCode: string): string {
    let color: string;
    switch (true) {
      case statusCode == 'tech':
        color = 'bleu-azure';
        break;
      case statusCode == 'evolution':
        color = 'bleu-chrysler';
        break;
      case statusCode == 'other':
        color = 'violet-veronica';
        break;
      case statusCode == 'future_sales':
        color = 'vert-shamrock';
        break;
      case statusCode == 'current_sales':
        color = 'gris-fonce-charte';
        break;
      case statusCode == 'finished_sales':
        color = 'bleu-clair-charte';
        break;
      default:
        color = 'bleu-azure';
        break;
    }
    return 'badge-' + color;
  }
}


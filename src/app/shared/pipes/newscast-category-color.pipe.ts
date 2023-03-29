import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'newsCastCategoryColor' })
export class NewsCastCategoryColor implements PipeTransform {
  transform(statusCode: string): string {
    let color: string;
    switch (true) {
      case statusCode == 'tech':
        color = 'orange-fonce-firebrick';
        break;
      case statusCode == 'evolution':
        color = 'bleu-azure';
        break;
      case statusCode == 'other':
        color = 'vert-shamrock';
        break;
      case statusCode == 'future_sales':
        color = 'violet-veronica';
        break;
      case statusCode == 'current_sales':
        color = 'violet-veronica';
        break;
      case statusCode == 'finished_sales':
        color = 'violet-veronica';
        break;
      default:
        color = 'bleu-azure';
        break;
    }
    return 'badge-' + color;
  }
}


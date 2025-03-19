import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'countWord' })
export class CountWordPipe implements PipeTransform {
    transform(words: string): number {
        if(!words){
            return 0;
        }
        const vArray = words.split(' ');
        let count = 0;
        vArray.forEach(v => {
            if (v.replace(/ /g, '').length > 0) {
                count++;
            }
        })
        return count;
    }
}
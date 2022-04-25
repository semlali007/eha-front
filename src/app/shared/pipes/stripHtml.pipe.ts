import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'striphtml'
})

export class StripHtmlPipe implements PipeTransform {
    transform(value: string): any {
        if(value == null){
            return "" ;
        }
        return value.replace(/<br\s*\/?>/gi,' '); // replace tags
       
    }
}
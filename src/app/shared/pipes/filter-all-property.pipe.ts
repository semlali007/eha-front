import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'filterAllProperty' })
export class FilterAllPropertyPipe implements PipeTransform {
 
  transform(list, input: string, args: Array<string>, operator: string): any {
    if(args[0] == "last_status_event"){
      return list;
    }
    if (input) {
      return list.filter(
        val => {
          for (let arg of args) {
            if (this.search(val[arg], input, operator??'like'))
              return true;
          }
          return false;
        }
      );
    } else {
      return list;
    }
  }

  search(text: string, word: string, operator: string){

    if(!text || !word || text.length==0 ||word.length==0){
      return false;
    }

    switch (operator) {
      case 'start':
        return text.toString().toLowerCase().startsWith(word.toString().toLowerCase());
      case 'like':
        return (text.toLowerCase().indexOf(word.toLowerCase()) >= 0);
        case 'equal':
          return text  == word;
      default:
        return false;
    }
  }

}
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtermulti'
})
export class FiltermultiPipe implements PipeTransform {
  transform(myobjects: Array<object>, args?: Array<object>,operator?:string): any {

    if (args && Array.isArray(myobjects)) {
      var returnobjects = myobjects;
      args.forEach(function (filterobj) {
        let filterkey = Object.keys(filterobj)[0];
        let filtervalue = filterobj[filterkey];
        myobjects.forEach(function (objectToFilter) {
            if( Array.isArray(filtervalue)){
                const listNoSpace =  filtervalue.filter(e =>  e);
                if(
                    listNoSpace.length > 0 && (!listNoSpace.includes(objectToFilter[filterkey]))
                ) 
                {
                    returnobjects = returnobjects.filter(obj => obj !== objectToFilter);
                }
            }else{
                if((objectToFilter[filterkey] != filtervalue && filtervalue != "") 
                ){
                    returnobjects = returnobjects.filter(obj => obj !== objectToFilter);
                }
            }
        })
      });
      return returnobjects;
    }
  }
}

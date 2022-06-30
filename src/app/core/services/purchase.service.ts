import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AppConfigService } from 'src/app/core/services/app-config.service';
import { HttpClient} from '@angular/common/http';
import { catchError, switchMap, finalize} from 'rxjs/operators';
import { ErrorService } from './error.service';
import { LoaderService } from './loader.service';
@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  constructor(
    private appConfigService: AppConfigService,
     private http: HttpClient,
     private errorService: ErrorService,
     private loaderService: LoaderService,
     ) { };



     search(params): Observable<any | null> {
      // params = A97609
      const url = `${this.appConfigService.basePath}/purchases/list`;
      this.loaderService.setLoading(true);
      return this.http.post(url, {
          words: params.words,
          offset: 0
      }).pipe(
        switchMap((data: any) => {
          const purchases: any = [];
         data.purchases.forEach(data => {
            purchases.push(data);
          });
          return of(purchases);
        }),
        catchError(error => this.errorService.handleError(error)),
        finalize(() => this.loaderService.setLoading(false))
      );

    }

  getPurchase(params): Observable<any | null> {
    // params = A97609
    const url = `${this.appConfigService.basePath}/purchases/search`;
    this.loaderService.setLoading(true);
    return this.http.post(url, {
      num_da: params.num_da,
    }).pipe(
      switchMap((data: any) => {
        let allItems = this.sortDate({ 'column': 'event_date', 'direction': 'asc' }, data.items);
        let purchases1 =  data.items.filter(p => p.section == 1 );
        let purchases2 =  data.items.filter(p => p.section == 2 );
        let purchases3 =  data.items.filter(p => p.section == 3 );
        let s = ((purchases1.length>0)?'1':'')+((purchases2.length>0)?'2':'')+((purchases3.length>0)?'3':'');
        let isPHA = true;
        if(s == '1'){
          isPHA = data.items.filter(p => p.last_status_event_label == 'Groupe acheteur' && !p.event_person.startsWith('A') && !p.event_person.startsWith('a')).length==0;
        }

        let steps = [];
        let c = true;
        while( c == true){
          let firstEventlabel = allItems[0].event_label;
          let result = allItems.findIndex(element => {
            return element.event_label !== firstEventlabel;
          });
          if(result!=-1){
            steps.push(allItems.slice(0, result));
            allItems =  allItems.slice(result, allItems.length);
          }else{
            steps.push(allItems.slice(0, allItems.length));
            allItems = [];
            c = false;
          }
        }
        const preparedSteps = [];
         steps.forEach(data => {
           let dir = 'desc';
           if(!!data[0] && !!data[0].event_label && data[0].event_label == 5){
            dir = 'asc';
           }
           
            let orderedStep = this.sortDate({ 'column': 'event_date', 'direction': dir }, data);
            preparedSteps.push({
              viewPerson: orderedStep[0].event_label == 4 || (orderedStep[0].event_label == 5 && orderedStep[0].last_status_event_label=="Acheteur - Intégrer à l'affaire => Refusé"),
              step: orderedStep[0],
              section: s,
              isPHA: isPHA
            });
          });
        return of(preparedSteps);
      }),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );

  }


  sort(params,data) {
    if (params.direction == 'asc') {
      data.sort((a, b) => {
        return (parseInt(a[params['column']]) < parseInt(b[params['column']])) ? -1 : 1;
      });
    } else {
      data.sort((a, b) => {
        return (parseInt(a[params['column']]) > parseInt(b[params['column']])) ? -1 : 1
      }
      );
    }
    return data;
  }
    sortDate(params, data) {
      if (params.direction == 'asc') {
        data.sort((a, b) => {
          return <any>new Date(a[params['column']]) - <any>new Date(b[params['column']]);
        });
      } else {
        data.sort((a, b) => {
          return <any>new Date(b[params['column']]) - <any>new Date(a[params['column']]);
        }
        );
      }
      return data;
    }

}

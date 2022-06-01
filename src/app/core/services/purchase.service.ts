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
      console.log(params) ;
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

        let purchases: any = [];

        data.purchase.forEach(data => {
          console.log('data', data);

         let purchases1 =  data.items.filter(p => p.section == 1 );
         let purchases2 =  data.items.filter(p => p.section == 2 );
         let purchases3 =  data.items.filter(p => p.section == 3 );
         if(purchases1.length == data.items.length){
///
         }

         if(purchases2.length == data.items.length){
           
         }
         
        if(purchases3.length == data.items.length){
           
        }

          let sData = this.sortDate({ 'column': 'event_date', 'direction': 'desc' }, data.items);
          let sData1 = this.sortDate({ 'column': 'event_date', 'direction': 'asc' }, data.items);
          purchases.push({
            status: (data.statut == '-1') ? 5 : data.statut,
            items: sData,
            lastItem: sData[0] || null,
            date: sData1[0]['event_date'],
          });
        });
        let ss = this.sort({ 'column': 'status', 'direction': 'asc' }, purchases);
        console.log('ss', ss);
        return of(ss);
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

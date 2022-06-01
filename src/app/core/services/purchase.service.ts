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
        let freeze = {
          section:'',
          initialized:null, 
          viewInitialized:false,
          transmitted:null, 
          transmittedViewed:false,
          managed:null, 
          managedViewed:false,
          affected:null, 
          affectedViewed:false,
          integred:null, 
          integredViewed:false,
          refusedViewed:false,
          refused:null
        };

        let purchases: any = [];
        let ordered = this.sort({ 'column': 'event_label', 'direction': 'desc' }, data.items); 
        let maxEvent = ordered[0].event_label;
        console.log('maxEvent',maxEvent);

        let purchases1 =  data.items.filter(p => p.section == 1 );
        let purchases2 =  data.items.filter(p => p.section == 2 );
        let purchases3 =  data.items.filter(p => p.section == 3 );
        let initialized =  data.items.filter(p => p.event_label == 1 );
        let transmitted =  data.items.filter(p => p.event_label == 2 );
        let managed =  data.items.filter(p => p.event_label == 3 );
        let affected =  data.items.filter(p => p.event_label == 4 );
        let integred =  data.items.filter(p => p.event_label == 5 );
        let refused =  data.items.filter(p => p.event_label == 6 );
        freeze.section = ((purchases1.length>0)?'1':'')+((purchases2.length>0)?'2':'')+((purchases3.length>0)?'3':'');
        freeze.refusedViewed=maxEvent>4;
        freeze.integredViewed=maxEvent>4;
        freeze.affectedViewed=maxEvent>3;
        freeze.managedViewed=maxEvent>2;
       freeze.transmittedViewed=maxEvent > 1;
       freeze.refused = refused[0] || null;
       if(freeze.section == '2' || freeze.section=='12' || freeze.section=='23' || freeze.section=='123'){
        let i = this.sortDate({ 'column': 'event_date', 'direction': 'desc' }, integred);
        freeze.integred = i[0]||null;

         let f = this.sortDate({ 'column': 'event_date', 'direction': 'desc' }, affected);
         freeze.affected = f[0]||freeze.integred;

         let m = this.sortDate({ 'column': 'event_date', 'direction': 'desc' }, managed);
         freeze.managed = m[0]||freeze.affected;

         let tList = this.sortDate({ 'column': 'event_date', 'direction': 'asc' }, transmitted);
         freeze.transmitted = tList[0]||freeze.managed;
       }
        freeze.viewInitialized=maxEvent>0;
        if(freeze.section == '12' || freeze.section=='123'){
           freeze.initialized =       
                              initialized.find(p => (p.last_status_event_label == 'Validation'))
                              || initialized.find(p => (p.last_status_event_label == 'freeze.initialized'))
                              || initialized.find(p => (p.last_status_event_label == 'Création'))
                              || freeze.transmitted;
        }
       
    

        

        
console.log('freeze.initialized',freeze.initialized);

        /*switch(freeze.section){
          case '1':
              if(initialized.length>0){
                freeze.initialized = 'initalisée';
              }

              if(initialized.length>0){
                freeze.initialized = 'initalisée';
              }
            break;
        }*/
        /*let sData = this.sortDate({ 'column': 'event_date', 'direction': 'desc' }, data.items);
          let sData1 = this.sortDate({ 'column': 'event_date', 'direction': 'asc' }, data.items);
          purchases.push({
            status: (data.statut == '-1') ? 5 : data.statut,
            items: sData,
            lastItem: sData[0] || null,
            date: sData1[0]['event_date'],
          });
      
        let ss = this.sort({ 'column': 'status', 'direction': 'asc' }, purchases);*/
        return of(freeze);
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

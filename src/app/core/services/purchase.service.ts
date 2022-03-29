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

}

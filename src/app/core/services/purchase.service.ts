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



  search(params: any): Observable<any | null> {
    const url = `${this.appConfigService.basePath}/purchases/search`;
    this.loaderService.setLoading(true);
    return this.http.post(url, {
        words: params.words,
    }).pipe(
      switchMap((data: any) => {
        const purchases: any = [];
        data.purchases.forEach(data => {
          const p = {
            section: data.section,
            identifiant: data.identifiant,
            nature: data.nature,
            eventLabel: data.event_label,
            eventDate: data.event_date,
            sectionLabel: (data.section == 1) ? "PGI" : (data.section == 2) ? "PHA" : data.section,
          };
          purchases.push(p);
        });

        return of(purchases);
      }),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );
  }

}

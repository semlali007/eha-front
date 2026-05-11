import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AppConfigService } from 'src/app/core/services/app-config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, switchMap, tap, finalize } from 'rxjs/operators';
import { ErrorService } from './error.service';
import { EhaDomain } from 'src/app/shared/models/eha-domain';
import { LoaderService } from './loader.service';
@Injectable({
  providedIn: 'root'
})
export class SubdomainService {
  constructor(
    private appConfigService: AppConfigService,
    private http: HttpClient,
    private errorService: ErrorService,
    private loaderService: LoaderService,
    ) { };


  public requestAutocompleteItems(text: string): Observable<any> {
    const url = `${this.appConfigService.basePath}/domains/autocomplete/${text}`;
    return this.http
      .get<any>(url)
      .pipe(
        switchMap((listData: any) => {
          const items = [];
          listData.forEach(data => {
            if (data) {
              items.push({
                code: data.id,
                label: data.name
              });
            }
          })
          return of(items);
        }),
        catchError(error => this.errorService.handleError(error))
      );
  }


  public getList(params: any): Observable<any> {
    const url = `${this.appConfigService.basePath}/subdomains/search`;
    this.loaderService.setLoading(true);
    return this.http.post(url, {
        page: params.page || 1,
        perpage: params.perPage || 10,
        search: params.search || '',
    }).pipe(
      switchMap((listData: any) => {
        const directions: EhaDomain[] = [];
        listData.data.forEach(data => {
          const p: EhaDomain = new EhaDomain({
            code: data.id,
            label: data.name,
          });
          directions.push(p);
        });
        return of({
          total: listData.total,
          subdomains: directions
        });
      }),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );
  }

  public add(direction: EhaDomain): Observable<any> {
    const url = `${this.appConfigService.basePath}/subdomains/add`;
    const data =  {"name":direction.label,"action":"add"};


    return this.http.post(url, data).pipe(
      tap(_ => console.log('success')),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => console.log('ok'))
    );
  }

}

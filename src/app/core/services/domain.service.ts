import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AppConfigService } from 'src/app/core/services/app-config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, switchMap, tap, finalize } from 'rxjs/operators';
import { ErrorService } from './error.service';
import { Domain } from 'src/app/shared/models/domain';
import { LoaderService } from './loader.service';
@Injectable({
  providedIn: 'root'
})
export class DomainService {
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
    const url = `${this.appConfigService.basePath}/domains/search`;
    this.loaderService.setLoading(true);
    return this.http.post(url, {
        page: params.page || 1,
        perpage: params.perPage || 10,
    }).pipe(
      switchMap((listData: any) => {
        const directions: Domain[] = [];
        listData.data.forEach(data => {
          const p: Domain = new Domain({
            code: data.id,
            label: data.name,
          });
          directions.push(p);
        });
        return of({
          total: listData.total,
          domains: directions
        });
      }),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );
  }

  public add(direction: Domain): Observable<any> {
    const url = `${this.appConfigService.basePath}/domains/add`;
    const data =  {"name":direction.label,"action":"add"};


    return this.http.post(url, data).pipe(
      tap(_ => console.log('success')),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => console.log('ok'))
    );
  }

}

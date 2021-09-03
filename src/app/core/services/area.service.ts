import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, switchMap, tap, finalize } from 'rxjs/operators';
import { ErrorService } from './error.service';
import { Area } from 'src/app/shared/models/area';
import { LoaderService } from './loader.service';
@Injectable({
  providedIn: 'root'
})
export class AreaService {
  constructor(
    private http: HttpClient, 
    private errorService: ErrorService,
    private loaderService: LoaderService,
    ) { };


  public requestAutocompleteItems(text: string): Observable<any> {
    const url = `${environment.api.auth.baseURL}/areas/autocomplete/${text}`;
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
    const url = `${environment.api.auth.baseURL}/areas/search`;
    this.loaderService.setLoading(true);
    return this.http.post(url, {
        page: params.page || 1,
        perpage: params.perPage || 10,
    }).pipe(
      switchMap((listData: any) => {
        const areas: Area[] = [];
        listData.data.forEach(data => {
          const p: Area = new Area({
            code: data.id,
            label: data.name,
          });
          areas.push(p);
        });
        return of({
          total: listData.total,
          areas: areas
        });
      }),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );
  }

  public add(area: Area): Observable<any> {
   
    const url = `${environment.api.auth.baseURL}/areas/add`;
    const data =  {"name":area.label,"action":"add"};
    return this.http.post(url, data).pipe(
      tap(_ => console.log('success')),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => console.log('ok'))
    );
  }

}

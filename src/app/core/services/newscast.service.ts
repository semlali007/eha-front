import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AppConfigService } from 'src/app/core/services/app-config.service';
import { HttpClient } from '@angular/common/http';
import { catchError, switchMap, tap, finalize } from 'rxjs/operators';
import { ErrorService } from './error.service';
import { LoaderService } from './loader.service';

@Injectable({
  providedIn: 'root'
})
export class NewsCastService {
  constructor(
    private appConfigService: AppConfigService,
    private http: HttpClient, 
    private errorService: ErrorService,
    private loaderService: LoaderService,
    ) {
     };
  
  public get(id: number): Observable<any> {
    const url = `${this.appConfigService.basePath}/admin/news-cast/get/${id}`;
    this.loaderService.setLoading(true);
    return this.http.get(url).pipe(
      switchMap((data: any) => {
        return of(data);
      }),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );
  }

  public getList(params: any): Observable<any> {
    const url = `${this.appConfigService.basePath}/admin/news-cast/list`;
    this.loaderService.setLoading(true);
    return this.http.post(url, {
        page: params.page || 1,
        perpage: params.perPage || 10,
        is_home: params.is_home || 0
    }).pipe(
      switchMap((listData: any) => {

        return of(listData);
      }),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );
  }

  public getCategories(): Observable<any> {
    const url = `${this.appConfigService.basePath}/admin/news-cast/categories`;
    this.loaderService.setLoading(true);
    return this.http.get(url).pipe(
      switchMap((listData: any) => {
        return of(listData);
      }),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );
  }


  public update(params: any): Observable<any> {
    const url = `${this.appConfigService.basePath}/admin/news-cast/update`;
    this.loaderService.setLoading(true);
    return this.http.post(url, params).pipe(
      switchMap((listData: any) => {
        return of(listData);
      }),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );
  }

  public create(params: any): Observable<any> {
    const url = `${this.appConfigService.basePath}/admin/news-cast/create`;
    this.loaderService.setLoading(true);
    return this.http.post(url, params).pipe(
      switchMap((listData: any) => {

        return of(listData);
      }),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );
  }

  
 public getStatusList() {
    return   [
      {
        code: 0,
        label: 'Non publié',
      },
      {
        code: 1,
        label: 'Publié',
      }
    ];
}
 
public getStatusLabel(code) {
  let label = '';
  this.getStatusList().forEach(s => {
      if (s.code == code) {
          label = s.label;
      }
  })
  return label;
}
}

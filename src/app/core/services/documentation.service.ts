import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, switchMap, tap, finalize } from 'rxjs/operators';
import { ErrorService } from './error.service';
import { AppConfigService } from 'src/app/core/services/app-config.service';
import { ToastrService } from './toastr.service';
import { LoaderService } from './loader.service';
import { map, publishReplay, refCount } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class DocumentationService {

  constructor(
    private appConfigService: AppConfigService,
    private http: HttpClient,
    private errorService: ErrorService,
    private toastrService: ToastrService,
    private loaderService: LoaderService,
  ) { };

  public getContent(): Observable<any> {

    let url = `${this.appConfigService.basePath}/documentations/edit`;
    this.loaderService.setLoading(true);
    return this.http.get(url).pipe(
      switchMap((listData: any) => {
        return of(listData);
      }),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );
  }

  public remove(params): Observable<any> {

    let url = `${this.appConfigService.basePath}/documentations/delete/${params.id}`;
    this.loaderService.setLoading(true);
    return this.http.get(url).pipe(
      tap(_ => this.toastrService.showToastr({
        category: 'success',
        message: 'Vos informations ont été mises à jour !'
      })),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );
  }

  public update(params: any): Observable<any> {

    let url = `${this.appConfigService.basePath}/documentations/update`;
    this.loaderService.setLoading(true);

    return this.http.post(url, params).pipe(
      tap(_ => this.toastrService.showToastr({
        category: 'success',
        message: 'Vos informations ont été mises à jour !'
      })),
      catchError(error => this.errorService.handleError('Erreur de modification')),
      finalize(() => this.loaderService.setLoading(false))
    );
  }

  getDocumentation(options: {
    reset?: string,
    cache?: string
  }): Observable<any> {

    let header: any = {};
    if (!!options.reset && options.reset == 'reset') {
      header.reset = options.reset;
    }

    if (!!options.cache && options.cache == 'cache') {
      header.cache = options.cache;
    }

    const httpOptions = {
      headers: new HttpHeaders(header)
    };
    this.loaderService.setLoading(true);
    return this.http.get(`${this.appConfigService.basePath}/documentations`, httpOptions).pipe(
      map(data => data),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );
  }


  public getDetails(params: any): Observable<any> {
    let url = `${this.appConfigService.basePath}/documentations/show/${params.id}`;
    this.loaderService.setLoading(true);
    return this.http.get(url,).pipe(
      switchMap((listData: any) => {
        return of(listData);
      }),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );
  }

  public add(params: any): Observable<any> {
    let data = {
      'label': params.label,
      'link': params.link,
      'breadcrumb': params.breadcrumb,
      'parent': params.parent,
      'external': !!params.external,
      'warning': params.warning,
      'description': params.description
    };

    let url = `${this.appConfigService.basePath}/documentations/add`;
    this.loaderService.setLoading(true);
    return this.http.post(url, data).pipe(
      tap(_ => this.toastrService.showToastr({
        category: 'success',
        message: 'Vos informations ont été mises à jour !'
      })),
      catchError(error => this.errorService.handleError('Erreur de modification')),
      finalize(() => this.loaderService.setLoading(false))
    );
  }

  public updatePositions(params: any): Observable<any> {

    let url = `${this.appConfigService.basePath}/documentations/sort`;
    this.loaderService.setLoading(true);

    return this.http.post(url, params).pipe(
      tap(_ => this.toastrService.showToastr({
        category: 'success',
        message: 'Vos informations ont été mises à jour !'
      })),
      catchError(error => this.errorService.handleError('Erreur de modification')),
      finalize(() => this.loaderService.setLoading(false))
    );
  }

  public import(params:any): Observable<any>{

    let url = `${this.appConfigService.basePath}/documentations/import`;

    // const data =  {"content":params.content, "type":params.type};

    return this.http.post(url, params).pipe(
      tap(_ => console.log('success')),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => console.log('ok'))
    );
  }

  public export(): Observable<any>{

    let url = `${this.appConfigService.basePath}/documentations/export`;
    this.loaderService.setLoading(true);

    return this.http.get(url).pipe(
      switchMap((listData: any) => {
        return of(listData);
      }),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );
  }

}

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, switchMap, tap, finalize } from 'rxjs/operators';
import { ErrorService } from './error.service';
import { environment } from '../../../environments/environment';
import { ToastrService } from './toastr.service';
import { LoaderService } from './loader.service';
import { map, publishReplay, refCount } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class DocumentationService {

  constructor(
    private http: HttpClient,
    private errorService: ErrorService,
    private toastrService: ToastrService,
    private loaderService: LoaderService,
  ) { };

  public getContent(): Observable<any> {

    let url = `${environment.api.auth.baseURL}/documentations/edit`;
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
    var data = {
      data: params.content,
    }
    let url = `${environment.api.auth.baseURL}/documentations/save`;
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

  getDocumentation(options: {
    reset?: string,
    cache?: string
  }): Observable<any> {

    let header : any = {};
    if(!!options.reset && options.reset == 'reset'){
      header.reset = options.reset;
    }

    if(!!options.cache && options.cache == 'cache'){
      header.cache = options.cache;
    }

    const httpOptions = {
      headers: new HttpHeaders(header)
    };
    return this.http.get(`${environment.api.auth.baseURL}/documentations`, httpOptions).pipe(
      map(data => JSON.parse(data['data']))
    );
  }

  clearCache() {
  }
  

  public getDetails(params: any): Observable<any> {
    let url = `${environment.api.auth.baseURL}/documentations/show/${params.id}`;
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
      'label': params.title,
      'link': params.url,
      'breadcrumb': params.breadcrumb,
      'parent': params.id,
      'external': !!params.external,
      'warning': params.warning,
      'description': params.description
    };

    let url = `${environment.api.auth.baseURL}/documentations/add`;
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
}

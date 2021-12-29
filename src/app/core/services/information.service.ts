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
export class InformationService {

  constructor(
    private appConfigService: AppConfigService,
    private http: HttpClient,
    private errorService: ErrorService,
    private toastrService: ToastrService,
    private loaderService: LoaderService,
  ) { };


  public updateInformation(params: any): Observable<any> {

    let url = `${this.appConfigService.basePath}/informations/save/${params.id}`;
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

  getInformation(options: {
    type?: string,
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
    return this.http.get(`${this.appConfigService.basePath}/informations/get/${options.type}`, httpOptions).pipe(
      map(data => data),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );
  }
  
  getList(options: {
    type?: string,
  }): Observable<any | null> {
    let url = `${this.appConfigService.basePath}/informations/list/${options.type}`;
    this.loaderService.setLoading(true);
    return this.http.get(url).pipe(
      switchMap((response: any) => {
        return of(
          response
        );
      }),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );
  }

  public getElement(params: any)
  {
    let url = `${this.appConfigService.basePath}/informations/edit/${params.id}`;
    this.loaderService.setLoading(true);
    return this.http.get(url).pipe(
      switchMap((response: any) => {
        return of(
          response
        );
      }),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );
  }


  public addInformation(type:string, params: any): Observable<any> {
    let url = `${this.appConfigService.basePath}/informations/add/${type}`;
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

  public remove(params): Observable<any> {

    let url = `${this.appConfigService.basePath}/informations/delete/${params.id}`;
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

}



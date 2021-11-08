import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, switchMap, tap, finalize } from 'rxjs/operators';
import { ErrorService } from './error.service';
import { LoaderService } from './loader.service';
import { environment } from '../../../environments/environment';
import { ToastrService } from './toastr.service';
import { DatePipe } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeFr, 'fr');

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  constructor(
    private http: HttpClient,
    private errorService: ErrorService,
    private loaderService: LoaderService,
    private toastrService: ToastrService,
) { };

  getList(): Observable<any | null> {
    let url = `${environment.api.auth.baseURL}/config/news/list`;
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


  public addNews(params: any): Observable<any> {
    let url = `${environment.api.auth.baseURL}/config/news/add`;
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

  public getElement(params: any)
  {
    let url = `${environment.api.auth.baseURL}/config/news/edit/${params.id}`;
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



  public updateNews(params: any): Observable<any> {
    let url = `${environment.api.auth.baseURL}/config/news/update`;
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

    let url = `${environment.api.auth.baseURL}/config/news/delete/${params.id}`;
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

  public getDate()
  {
    var pipe = new DatePipe('fr');
    const now = Date.now();
    const myFormattedDate = pipe.transform(now, 'short');
    return(myFormattedDate);
  }
}

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, switchMap, tap, finalize } from 'rxjs/operators';
import { ErrorService } from './error.service';
import { ToastrService } from './toastr.service';
import { LoaderService } from './loader.service';
@Injectable({
  providedIn: 'root'
})
export class HotlineEmailService {
  constructor(
    private http: HttpClient,
    private errorService: ErrorService,
    private toastrService: ToastrService,
    private loaderService: LoaderService,
  ) { };

  public getList(params: any): Observable<any> {

    let url = `${environment.api.auth.baseURL}/hotline-emails`;
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
    let url = `${environment.api.auth.baseURL}/hotline-emails/living-save`;

    this.loaderService.setLoading(true);
    return this.http.post(url, { id: params.id }).pipe(
      tap(_ => this.toastrService.showToastr({
        category: 'success',
        message: 'Vos informations ont été mises à jour !'
      })),
      catchError(error => this.errorService.handleError('Erreur de modification')),
      finalize(() => this.loaderService.setLoading(false))
    );
  }

  public edit(params: any): Observable<any> {
    var data = {
      email: params.email,
      id: params.id
    }

    let url = `${environment.api.auth.baseURL}/hotline-emails/save`;
    this.loaderService.setLoading(true);
    return this.http.post(url,data).pipe(
      tap(_ => this.toastrService.showToastr({
        category: 'success',
        message: 'Vos informations ont été mises à jour !'
      })),
      catchError(error => this.errorService.handleError('Erreur de modification')),
      finalize(() => this.loaderService.setLoading(false))
    );
  }
}

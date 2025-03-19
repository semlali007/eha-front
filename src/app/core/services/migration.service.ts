import { Injectable } from '@angular/core';
import { AppConfigService } from 'src/app/core/services/app-config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, switchMap, tap, finalize } from 'rxjs/operators';
import { ErrorService } from './error.service';
import { LoaderService } from './loader.service';
import { ToastrService } from './toastr.service';
import { Observable, of } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class MigrationService {
  constructor(
    private appConfigService: AppConfigService,
    private http: HttpClient,
    private errorService: ErrorService,
    private loaderService: LoaderService,
    private toastrService: ToastrService,
  ) { };

  public uploadData(params) {
    let url = `${this.appConfigService.basePath}/migration/save`;

    const data =  {"content":params.content, "type":params.type};

    return this.http.post(url, data).pipe(
      tap(_ => console.log('success')),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => console.log('ok'))
    );
  }


  public getList(params: any): Observable<any> {
    let url = `${this.appConfigService.basePath}/migration/list`;
    this.loaderService.setLoading(true);
    return this.http.post(url, params).pipe(
      switchMap((listData: any) => {
        const data :any = [];
          listData.data.forEach(element => {
            element.isSelected = false;
            data.push(element);

          });

        return of(data);
      }),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );
  }


  public migrateDait(params) {
    let url = `${this.appConfigService.basePath}/migration/migrate`;
    this.loaderService.setLoading(true);
    return this.http.post(url, params).pipe(
      switchMap((data: any) => {
        if (!!data.status && data.status == 500) {
          throw data.message;
        } else {
          this.toastrService.showToastr({
            category: 'success',
            message: 'Votre fiche a été enregistrée avec succès.'
          })
        }
        return of(data);
      }),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );
  }

  public migrateDapi(params) {
    let url = `${this.appConfigService.basePath}/migration/migrate`;
    this.loaderService.setLoading(true);
    return this.http.post(url, params).pipe(
      switchMap((data: any) => {
        if (!!data.status && data.status == 500) {
          throw data.message;
        } else {
          this.toastrService.showToastr({
            category: 'success',
            message: 'Votre fiche a été enregistrée avec succès.'
          })
        }
        return of(data);
      }),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );
  }

  public migrateDatp(params) {
    let url = `${this.appConfigService.basePath}/migration/migrate`;
    this.loaderService.setLoading(true);
    return this.http.post(url, params).pipe(
      switchMap((data: any) => {
        if (!!data.status && data.status == 500) {
          throw data.message;
        } else {
          this.toastrService.showToastr({
            category: 'success',
            message: 'Votre fiche a été enregistrée avec succès.'
          })
        }
        return of(data);
      }),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );
  }
}

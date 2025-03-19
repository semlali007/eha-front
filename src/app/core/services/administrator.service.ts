import { Injectable, Injector } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, switchMap, tap, finalize } from 'rxjs/operators';
import { ErrorService } from './error.service';
import { ToastrService } from './toastr.service';
import { LoaderService } from './loader.service';
import { AppConfigService } from 'src/app/core/services/app-config.service';
@Injectable({
  providedIn: 'root'
})
export class AdministratorService {
  
  constructor(
    private appConfigService: AppConfigService,
    private http: HttpClient,
    private errorService: ErrorService,
    private toastrService: ToastrService,
    private loaderService: LoaderService,
    
  ) { 
  };

  public getList(params: any): Observable<any> {
    let url = `${this.appConfigService.basePath}/administrators`;
    this.loaderService.setLoading(true);
    return this.http.get(url).pipe(
      switchMap((listData: any) => {
        return of(listData);
      }),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );
  }

  public add(params: any): Observable<any> {

    let url = `${this.appConfigService.basePath}/administrators/create`;
    this.loaderService.setLoading(true);
    return this.http.post(url, { email: params.email }).pipe(
      tap(_ => this.toastrService.showToastr({
        category: 'success',
        message: 'Vos informations ont été mises à jour !'
      })),
      catchError(error => this.errorService.handleError('Erreur d\'ajout')),
      finalize(() => this.loaderService.setLoading(false))
    );
  }
  public delete(params: any): Observable<any> {
    let url = `${this.appConfigService.basePath}/administrators/delete/${params.email}`;
    this.loaderService.setLoading(true);
    return this.http.get(url).pipe(
      tap(_ => this.toastrService.showToastr({
        category: 'success',
        message: 'Vos informations ont été mises à jour !'
      })),
      catchError(error => this.errorService.handleError('Erreur de suppression')),
      finalize(() => this.loaderService.setLoading(false))
    );
  }
}
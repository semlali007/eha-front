import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AppConfigService } from 'src/app/core/services/app-config.service';
import { HttpClient } from '@angular/common/http';
import { catchError, switchMap, tap, finalize } from 'rxjs/operators';
import { ErrorService } from './error.service';
import { LoaderService } from './loader.service';
import { ToastrService } from './toastr.service';

@Injectable({
  providedIn: 'root'
})
export class SatisfactionService {
  constructor(
    private appConfigService: AppConfigService,
    private http: HttpClient, 
    private errorService: ErrorService,
    private loaderService: LoaderService,
    private toastrService: ToastrService,
    ) {
     };
  


  public create(params: any): Observable<any> {
    const url = `${this.appConfigService.basePath}/satisfaction/create`;
    this.loaderService.setLoading(true);
    return this.http.post(url, params).pipe(
      switchMap((listData: any) => {
        return of(listData);
      }),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );
  }

  

  public getList()
  {
    let url = `${this.appConfigService.basePath}/satisfaction/list`;
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

  public getParticipation(params: any)
  {
    let url = `${this.appConfigService.basePath}/satisfaction/get/${params.nni}/${params.cockpit_id}`;
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
}

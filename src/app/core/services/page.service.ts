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
export class PageService {

  constructor(
    private appConfigService: AppConfigService,
    private http: HttpClient,
    private errorService: ErrorService,
    private toastrService: ToastrService,
    private loaderService: LoaderService,
  ) { };


  public update(params: any): Observable<any> {

    let url = `${this.appConfigService.basePath}/pages/edit/${params.page}`;
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

  getPage(options: {
    page?: string,
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
    return this.http.get(`${this.appConfigService.basePath}/pages/get/${options.page}`, httpOptions).pipe(
      map(data => data),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );
  }
  
}

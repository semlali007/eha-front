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
export class SearchLogService {

  constructor(
    private appConfigService: AppConfigService,
    private http: HttpClient,
    private errorService: ErrorService,
    private toastrService: ToastrService,
    private loaderService: LoaderService,
  ) { };

  public updatefactsheet(params) {
    let url = `${this.appConfigService.basePath}/factsheets/save/${params.id}`;
    var formData = new FormData();
    formData.append('file', params.file);
    formData.append('title', params.title);
    this.loaderService.setLoading(true);
    return this.http.post(url, formData).pipe(
      switchMap((listData: any) => {
        return of(listData);
      }),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );
  }

  getfactsheet(options: {
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
    return this.http.get(`${this.appConfigService.basePath}/factsheets/get/${options.type}`, httpOptions).pipe(
      map(data => data),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );
  }

  getAssociatedList(options: {
    type?: string,
  }): Observable<any | null> {
    let url = `${this.appConfigService.basePath}/admin/recherche/associated/list`;
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

  
  getSearchedList(options: {
    type?: string,
  }): Observable<any | null> {
    let url = `${this.appConfigService.basePath}/admin/recherche/words/list`;
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

  getIgnoreList(options: {
    type?: string,
  }): Observable<any | null> {
    let url = `${this.appConfigService.basePath}/admin/recherche/ignored/list`;
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

  public addIgnored(params) {
    let url = `${this.appConfigService.basePath}/admin/recherche/ignored/add`;
    this.loaderService.setLoading(true);
    return this.http.post(url, params).pipe(
      switchMap((listData: any) => {
        return of(listData);
      }),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );
  }
  

  public addSynonymous(params) {
    let url = `${this.appConfigService.basePath}/admin/recherche/synonymous/add`;
    this.loaderService.setLoading(true);
    return this.http.post(url, params).pipe(
      switchMap((listData: any) => {
        return of(listData);
      }),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );
  }


  public addAssociated(params) {
    let url = `${this.appConfigService.basePath}/admin/recherche/associated/add`;
    this.loaderService.setLoading(true);
    return this.http.post(url, params).pipe(
      switchMap((listData: any) => {
        return of(listData);
      }),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );
  }

  public updateAssociated(params) {
    let url = `${this.appConfigService.basePath}/admin/recherche/associated/update/${params.id}`;
    this.loaderService.setLoading(true);
    return this.http.post(url, params).pipe(
      switchMap((listData: any) => {
        return of(listData);
      }),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );
  }

  public removeIgnored(params): Observable<any> {

    let url = `${this.appConfigService.basePath}/admin/recherche/ignored/delete/${params.id}`;
    this.loaderService.setLoading(true);
    return this.http.get(url).pipe(
      tap(_ => this.toastrService.showToastr({
        category: 'success',
        message: 'Le mot est supprimé avec succès!'
      })),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );
  }

  public removeSynonymous(params): Observable<any> {

    let url = `${this.appConfigService.basePath}/admin/recherche/synonymous/delete/${params.id}`;
    this.loaderService.setLoading(true);
    return this.http.get(url).pipe(
      tap(_ => this.toastrService.showToastr({
        category: 'success',
        message: 'Vos factsheets ont été mises à jour !'
      })),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );
  }

  public removeAssociated(params): Observable<any> {

    let url = `${this.appConfigService.basePath}/admin/recherche/associated/delete/${params.id}`;
    this.loaderService.setLoading(true);
    return this.http.get(url).pipe(
      tap(_ => this.toastrService.showToastr({
        category: 'success',
        message: 'Vos factsheets ont été mises à jour !'
      })),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );
  }
  
  



  getLogsList(options: {
    type?: string,
  }): Observable<any | null> {
    let url = `${this.appConfigService.basePath}/admin/recherche/logs`;
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
    let url = `${this.appConfigService.basePath}/factsheets/edit/${params.id}`;
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




  public addfactsheet(params) {
    let url = `${this.appConfigService.basePath}/factsheets/upload`;
    var formData = new FormData();
    formData.append('file', params.file);
    formData.append('title', params.title);
    this.loaderService.setLoading(true);
    return this.http.post(url, formData).pipe(
      switchMap((listData: any) => {
        return of(listData);
      }),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );
  }


  public remove(params): Observable<any> {

    let url = `${this.appConfigService.basePath}/factsheets/delete/${params.id}`;
    this.loaderService.setLoading(true);
    return this.http.get(url).pipe(
      tap(_ => this.toastrService.showToastr({
        category: 'success',
        message: 'Vos factsheets ont été mises à jour !'
      })),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );
  }


  getDocument(params: any): Observable<any> {
    const url = `${this.appConfigService.basePath}/factsheets/download`;
    this.loaderService.setLoading(true);
    return this.http.post(url, {id:params.id},{ responseType: 'blob' })
        .pipe(
            sheetData => sheetData,
            catchError(error => this.errorService.handleError(error)),
            finalize(() => this.loaderService.setLoading(false))
        );
}

}



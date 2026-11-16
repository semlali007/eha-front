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
export class NewsCastService {
  constructor(
    private appConfigService: AppConfigService,
    private http: HttpClient, 
    private errorService: ErrorService,
    private loaderService: LoaderService,
    private toastrService: ToastrService,
    ) {
     };
  
  /** Endpoint public — utilisé par la vue actualités côté front (protected) */
  public get(id: number): Observable<any> {
    const url = `${this.appConfigService.basePath}/news-cast/get/${id}`;
    this.loaderService.setLoading(true);
    return this.http.get(url).pipe(
      switchMap((data: any) => {
        return of(data);
      }),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );
  }

  /** Endpoint admin — utilisé par la vue & le formulaire d'actualités côté administration */
  public getAdmin(id: number): Observable<any> {
    const url = `${this.appConfigService.basePath}/admin/news-cast/get/${id}`;
    this.loaderService.setLoading(true);
    return this.http.get(url).pipe(
      switchMap((data: any) => {
        return of(data);
      }),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );
  }

  public getList(
   params:{
    page?:number,
    perPage?:number,
    is_home?:number,
    category?:any
   }
  ): Observable<any> {
    const url = `${this.appConfigService.basePath}/admin/news-cast/list`;
    this.loaderService.setLoading(true);
    return this.http.post(url, {
        page: params.page || 1,
        perpage: params.perPage || 10,
        is_home: params.is_home || 0,
        category:params.category || ''
    }).pipe(
      switchMap((listData: any) => {

        return of(listData);
      }),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );
  }


  public getFrontList(
    params:{
     page?:number,
     perPage?:number,
     is_home?:number,
     category?:any
    }
   ): Observable<any> {
     const url = `${this.appConfigService.basePath}/news-cast/list`;
     this.loaderService.setLoading(true);
     return this.http.post(url, {
         page: params.page || 1,
         perpage: params.perPage || 100,
         is_home: params.is_home || 0,
         category:params.category || ''
     }).pipe(
       switchMap((listData: any) => {
 
         return of(listData);
       }),
       catchError(error => this.errorService.handleError(error)),
       finalize(() => this.loaderService.setLoading(false))
     );
   }

  public getCategories(): Observable<any> {
    const url = `${this.appConfigService.basePath}/news-cast/categories`;
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
    const url = `${this.appConfigService.basePath}/admin/news-cast/update`;
    this.loaderService.setLoading(true);
    return this.http.post(url, params).pipe(
      switchMap((listData: any) => {
        return of(listData);
      }),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );
  }

  public create(params: any): Observable<any> {
    const url = `${this.appConfigService.basePath}/admin/news-cast/create`;
    this.loaderService.setLoading(true);
    return this.http.post(url, params).pipe(
      switchMap((listData: any) => {

        return of(listData);
      }),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );
  }

  
 public getStatusList() {
    return   [
      {
        code: 0,
        label: 'Non publié',
      },
      {
        code: 1,
        label: 'Publié',
      }
    ];
}
 
public getStatusLabel(code) {
  let label = '';
  this.getStatusList().forEach(s => {
      if (s.code == code) {
          label = s.label;
      }
  })
  return label;
}


public updatePositions(params: any): Observable<any> {
  let url = `${this.appConfigService.basePath}/admin/news-cast/sort`;
  this.loaderService.setLoading(true);
  return this.http.post(url, params).pipe(
    tap(_ => this.toastrService.showToastr({
      category: 'success',
      message: 'Vos informations ont été mises à jour !'
    })),
    catchError(error => this.errorService.handleError(error, true)),
    finalize(() => this.loaderService.setLoading(false))
  );
}
public remove(id){
  let url = `${this.appConfigService.basePath}/admin/news-cast/delete`;
  this.loaderService.setLoading(true);
  return this.http.post(url, {id:id}).pipe(
    tap(_ => this.toastrService.showToastr({
      category: 'success',
      message: 'Vos informations ont été mises à jour !'
    })),
    catchError(error => this.errorService.handleError(error, true)),
    finalize(() => this.loaderService.setLoading(false))
  );
}

}

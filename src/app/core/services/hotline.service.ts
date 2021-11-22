import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AppConfigService } from 'src/app/core/services/app-config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, switchMap, tap, finalize } from 'rxjs/operators';
import { ErrorService } from './error.service';
import { HotlineTheme } from 'src/app/shared/models/hotlineTheme';
import { HotlineFamily } from 'src/app/shared/models/hotlineFamily';
import { HotlineCategory } from 'src/app/shared/models/hotlineCategory';
import { LoaderService } from './loader.service';

@Injectable({
  providedIn: 'root'
})
export class HotlineService {
  constructor(
    private appConfigService: AppConfigService,
    private http: HttpClient,
    private errorService: ErrorService,
    private loaderService: LoaderService,
  ) { };

  public getConfig(): Observable<any> {
    const url = `${this.appConfigService.basePath}/hotlines/configuration`;
    return this.http.get(url).pipe(
      switchMap((listData: any) => {
        const themes: HotlineTheme[] = [];
        const families: HotlineFamily[] = [];
        listData.themes.forEach(data => {
          const t: HotlineTheme = new HotlineTheme({
            code: data.code,
            label: data.label,
          });
          themes.push(t);
        });

        listData.families.forEach(familyData => {
          const f: HotlineFamily = new HotlineFamily({
            code: familyData.code,
            label: familyData.label,
            categories: this.getCategories(familyData.code, listData.categories)
          });
          families.push(f);
        });

        return of({
          themes: themes,
          families: families
        });
      }),
      catchError(error => this.errorService.handleError(error))
    );
  }

  getCategories(familyCode: string, allCategories: any): HotlineCategory[] {
    const categories: HotlineCategory[] = [];
    allCategories.forEach(categ => {
      if (categ.family == familyCode) {
        categories.push(new HotlineCategory({
          code: categ.code,
          label: categ.label
        }))
      }
    })
    return categories;
  }

  public createHotline(params): Observable<any> {
    let url = `${this.appConfigService.basePath}/hotlines/create`;
    this.loaderService.setLoading(true);
    return this.http.post(url, params).pipe(
      switchMap((listData: any) => {
        return of(listData);
      }),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );
  }


  getHotlineByUser(params): any {
    const url = `${this.appConfigService.basePath}/hotlines`;

    this.loaderService.setLoading(true);
    return this.http.post(url,params).pipe(
      switchMap((hotlinesData: any) => {
        return of({
          new: this.getHotlines(hotlinesData.data.new) || [],
          progress: this.getHotlines(hotlinesData.data.progress) || [],
          end: this.getHotlines(hotlinesData.data.end) || [],
        });
      }),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );
  }

  getHotlines(hotlinesServer) {
    let hotlines: any = [];
    hotlinesServer.forEach(n => {
      if (!!n.id) {
        let hItem = this.getItem({
          id: n.id,
          openedAt: n.opened_at,
          closedAt: n.closed_at,
          question: n.question,
          sha: n.sha,
        });
        hotlines.push(hItem)
      }
    });
    return hotlines;
  }
  getItem(options: {
    id?: string,
    openedAt?: string,
    closedAt?: string,
    question?: string,
    sha?: string,

  } = {}) {

    return {
      id: options.id || null,
      openedAt: !!options.openedAt ? options.openedAt.slice(0, 10) : '',
      closedAt: !!options.closedAt ? options.closedAt.slice(0, 10) : '',
      question: options.question || '',
      sha: options.sha || '',
    }
  }

  getHotline(params): Observable<any | null> {
    const id = encodeURIComponent(params.id);
    let url = `${this.appConfigService.basePath}/hotlines/get/${id}`;

    if (!!params.sha && params.sha.length > 0) {
      url += '/sha/' + encodeURIComponent(params.sha);
    }

    this.loaderService.setLoading(true);
    return this.http.get(url).pipe(
      switchMap((hotlineData: any) => {
        return of(this.getHotlineFromApi(hotlineData.data));
      }),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );
  }

  getHotlineFromApi(hotlineApi: any) {
    return hotlineApi;
  }

  public postMessage(params): Observable<any> {
    let url = `${this.appConfigService.basePath}/hotlines/post`;
    this.loaderService.setLoading(true);
    return this.http.post(url, params).pipe(
      switchMap((listData: any) => {
        return of(listData);
      }),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );
  }

  public forward(params): Observable<any> {
    let url = `${this.appConfigService.basePath}/hotlines/forward`;
    this.loaderService.setLoading(true);
    return this.http.post(url, params).pipe(
      switchMap((listData: any) => {
        return of(listData);
      }),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );
  }

  public addFile(params) {
    let url = `${this.appConfigService.basePath}/hotlines/upload`;
    var formData = new FormData();
    formData.append('file', params.file);
    formData.append('name', params.name);
    formData.append('sha', params.sha);
    formData.append('id', params.id);
    this.loaderService.setLoading(true);
    return this.http.post(url, formData).pipe(
      switchMap((listData: any) => {
        return of(listData);
      }),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );
  }

  public close(params): Observable<any> {
    let url = `${this.appConfigService.basePath}/hotlines/close`;
    this.loaderService.setLoading(true);
    return this.http.post(url, params).pipe(
      switchMap((listData: any) => {
        return of(listData);
      }),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );
  }
}

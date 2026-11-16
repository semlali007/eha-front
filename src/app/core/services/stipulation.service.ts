import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AppConfigService } from 'src/app/core/services/app-config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, switchMap, tap, finalize } from 'rxjs/operators';
import { ErrorService } from './error.service';
import { Stipulation } from 'src/app/shared/models/stipulation';
import { ToastrService } from './toastr.service';
import { LoaderService } from './loader.service';
@Injectable({
  providedIn: 'root'
})
export class StipulationService {
  constructor(
    private appConfigService: AppConfigService,
    private http: HttpClient,
    private errorService: ErrorService,
    private toastrService: ToastrService,
    private loaderService: LoaderService,
    ) { };

  public requestAutocompleteItems(text: string): Observable<any> {
    const url = `${this.appConfigService.basePath}/stipulationAutrui/autocomplete/${text}`;

    return this.http
      .get<any>(url)
      .pipe(
        switchMap((listData: any) => {
          const items = [];
          listData.forEach(data => {
            if (data) {
              items.push({
                code: data.id,
                label: data.name
              });
            }
          })
          return of(items);
        }),
        catchError(error => this.errorService.handleError(error))
      );
  }


  public getList(params: any): Observable<any> {
    const url = `${this.appConfigService.basePath}/stipulationAutrui/search`;
    this.loaderService.setLoading(true);
    return this.http.post(url, {
        page: params.page || 1,
        perpage: params.perPage || 10,
        search: params.search || '',
    }).pipe(
      switchMap((listData: any) => {
        const stipulationAutrui: Stipulation[] = [];
        listData.data.forEach(data => {
          const p: Stipulation = new Stipulation({
            code: data.id,
            label: data.name,
          });
          stipulationAutrui.push(p);
        });
        return of({
          total: listData.total,
          stipulationAutrui: stipulationAutrui
        });
      }),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );
  }

  public add(stipulation: Stipulation): Observable<any> {
    const url = `${this.appConfigService.basePath}/stipulationAutrui/add`;
    const data =  {"name":stipulation.label,"action":"add"};
    this.loaderService.setLoading(true);

    return this.http.post(url, data).pipe(
      tap(_ => this.toastrService.showToastr({
        category: 'success',
        message: 'Votre bénéficiaire a été enregistré avec succès.'
      })),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );
  }

  filter(params): Observable<any | null> {
    let url = `${this.appConfigService.basePath}/sheets/filter`;
    const data = { "type": 'stipulation', "code": params.code };
    this.loaderService.setLoading(true);
    return this.http.post(url, data).pipe(
      switchMap((response: any) => {
        return of(
          response
        );
      }),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );
  }

  public remove(params): Observable<any> {
    let url = `${this.appConfigService.basePath}/stipulationAutrui/remove/${params.code}`;
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

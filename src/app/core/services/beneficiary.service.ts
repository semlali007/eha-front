import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, switchMap, tap, finalize } from 'rxjs/operators';
import { ErrorService } from './error.service';
import { Beneficiary } from 'src/app/shared/models/beneficiary';
import { ToastrService } from './toastr.service';
import { LoaderService } from './loader.service';
@Injectable({
  providedIn: 'root'
})
export class BeneficiaryService {
  constructor(
    private http: HttpClient,
    private errorService: ErrorService,
    private toastrService: ToastrService,
    private loaderService: LoaderService,
    ) { };

  public requestAutocompleteItems(text: string): Observable<any> {
    const url = `${environment.api.auth.baseURL}/beneficiaries/autocomplete/${text}`;

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
    const url = `${environment.api.auth.baseURL}/beneficiaries/search`;
    this.loaderService.setLoading(true);
    return this.http.post(url, {
        page: params.page || 1,
        perpage: params.perPage || 10,
    }).pipe(
      switchMap((listData: any) => {
        const beneficiaries: Beneficiary[] = [];
        listData.data.forEach(data => {
          const p: Beneficiary = new Beneficiary({
            code: data.id,
            label: data.name,
          });
          beneficiaries.push(p);
        });
        return of({
          total: listData.total,
          beneficiaries: beneficiaries
        });
      }),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );
  }

  public add(beneficiary: Beneficiary): Observable<any> {
    const url = `${environment.api.auth.baseURL}/beneficiaries/add`;
    const data =  {"name":beneficiary.label,"action":"add"};
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
}

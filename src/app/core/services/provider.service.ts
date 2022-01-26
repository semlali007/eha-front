import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AppConfigService } from 'src/app/core/services/app-config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, switchMap, finalize, tap} from 'rxjs/operators';
import { ErrorService } from './error.service';
import { Provider } from 'src/app/shared/models/provider';
import { LoaderService } from './loader.service';
import { Beneficiary } from 'src/app/shared/models/beneficiary';
import { ToastrService } from './toastr.service';
@Injectable({
  providedIn: 'root'
})
export class ProviderService {
  constructor(
    private appConfigService: AppConfigService,
     private http: HttpClient,
     private errorService: ErrorService,
     private loaderService: LoaderService,
     private toastrService: ToastrService,

     ) { };


  public requestAutocompleteItems(text: string): Observable<any> {
    const url = `${this.appConfigService.basePath}/providers/autocomplete/${text}`;
    return this.http
      .get<any>(url)
      .pipe(
        switchMap((providersData: any) => {
          const providers = [];
          providersData.forEach(data => {
            if (data) {
              providers.push({
                code: data.id,
                label: data.name
              });
            }
          })
          return of(providers);
        }),
        catchError(error => this.errorService.handleError(error))
      );
  }

  getProviders(params: any): any {
    const url = `${this.appConfigService.basePath}/providers/search`;
    this.loaderService.setLoading(true);
    return this.http.post(url, {
        page: params.page || 1,
        perpage: params.perPage || 5
    }).pipe(
      switchMap((providersData: any) => {
        const providers: Provider[] = [];
        providersData.data.forEach(data => {
          const p: Provider = new Provider({
            code: data.id,
            label: data.name,
          });
          providers.push(p);
        });
        return of({
          total: providersData.total,
          providers: providers
        });
      }),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );
  }

  get(params): Observable<any | null> {
    let url = `${this.appConfigService.basePath}/providers/show/${params.code}`;
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

public add(provider: Provider): Observable<any> {
  const url = `${this.appConfigService.basePath}/providers/add`;
  const data =  {"provider_label":provider.label,"action":"add"};
  this.loaderService.setLoading(true);

  return this.http.post(url, data).pipe(
    tap(_ => this.toastrService.showToastr({
      category: 'success',
      message: 'Votre fournisseur a été enregistré avec succès.'
    })),
    catchError(error => this.errorService.handleError(error)),
    finalize(() => this.loaderService.setLoading(false))
  );
}
}

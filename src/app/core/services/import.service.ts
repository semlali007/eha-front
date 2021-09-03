import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, switchMap, tap, finalize } from 'rxjs/operators';
import { ErrorService } from './error.service';
import { LoaderService } from './loader.service';
import { ToastrService } from './toastr.service';

import { of } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ImportService {
  constructor(
    private http: HttpClient,
    private errorService: ErrorService,
    private loaderService: LoaderService,
    private toastrService: ToastrService,
  ) { };


  public addFile(params) {
    let url = `${environment.api.auth.baseURL}/import/upload`;
    var formData = new FormData();
    formData.append('table_name', params.tableName);
    formData.append('file', params.file);
    this.loaderService.setLoading(true);
    return this.http.post(url, formData).pipe(
      switchMap((data: any) => {
        if (!data.message) {
          throw 'Une erreur est survenue';
        }

        if (!!data.color && data.color === 'green') {
          this.toastrService.showToastr({
            category: 'success',
            message: 'Votre Fiche a été enregistrée avec succès.'
          })
        }else{
          throw data.message;
        }
        return of(data);
      }),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );
  }

}

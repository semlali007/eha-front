import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, switchMap, tap, finalize } from 'rxjs/operators';
import { ErrorService } from './error.service';
import { LoaderService } from './loader.service';

@Injectable({
    providedIn: 'root'
})
export class ContractService {
    constructor(
        private http: HttpClient,
        private errorService: ErrorService,
        private loaderService: LoaderService,
    ) { };

    get(params): Observable<any | null> {
        const code = encodeURIComponent(params.code);
        let url = `${environment.api.auth.baseURL}/contracts/show/${code}`;
        this.loaderService.setLoading(true);
        return this.http.get(url).pipe(
            switchMap((response: any) => {
                let infos = response.infos;
                var i = parseInt(infos.contract_date_start.substring(0, 4));
                infos.showJauge = (i > 2012) ? true : false;
                infos.shortSystem = infos.system.substr(3,1);
                return of(
                    {
                        infos: infos,
                        postes: response.postes,
                        sheets: response.sheets || []
                    }
                );
            }),
            catchError(error => this.errorService.handleError(error)),
            finalize(() => this.loaderService.setLoading(false))
        );
    }


    search(params): Observable<any | null> {
        const code = encodeURIComponent(params.q);
        let url = `${environment.api.auth.baseURL}/contracts/search/${code}`;
        this.loaderService.setLoading(true);
        return this.http.get(url).pipe(
            switchMap((response: any) => {
                return of(
                    {
                        total: response.total,
                        sheets: response.data || []
                    }
                );
            }),
            catchError(error => this.errorService.handleError(error)),
            finalize(() => this.loaderService.setLoading(false))
        );
    }
}
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AppConfigService } from 'src/app/core/services/app-config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, switchMap, tap, finalize } from 'rxjs/operators';
import { ErrorService } from './error.service';
import { LoaderService } from './loader.service';

@Injectable({
    providedIn: 'root'
})
export class DauphinService {
    constructor(
        private appConfigService: AppConfigService,
        private http: HttpClient,
        private errorService: ErrorService,
        private loaderService: LoaderService,
    ) { };

    get(params): Observable<any | null> {
        const code = encodeURIComponent(params.code);
        let url = `${this.appConfigService.basePath}/dauphins/show/${code}`;
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
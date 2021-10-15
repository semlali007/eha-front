import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, switchMap, tap, finalize } from 'rxjs/operators';
import { ErrorService } from './error.service';
import { LoaderService } from './loader.service';
import { UserNews } from 'src/app/shared/models/userNews';

@Injectable({
    providedIn: 'root'
})
export class ConfigService {
    constructor(
        private http: HttpClient,
        private errorService: ErrorService,
        private loaderService: LoaderService
    ) { };

    getNews(): Observable<any | null> {
        let url = `${environment.api.auth.baseURL}/config/news`;
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

    createUserNews(userNews:UserNews[]): Observable<any | null> {
        let url = `${environment.api.auth.baseURL}/config/create-user-news`;
        this.loaderService.setLoading(true);
        return this.http.post(url,userNews).pipe(
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
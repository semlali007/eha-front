import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { AppConfigService } from 'src/app/core/services/app-config.service';
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
        private appConfigService: AppConfigService,
        private http: HttpClient,
        private errorService: ErrorService,
        private loaderService: LoaderService
    ) { };

    private isViewed: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public readonly isViewed$: Observable<boolean> = this.isViewed.asObservable(); 

    public tagModalViewed(state:boolean) {
        this.isViewed.next(state);
    }

    getNews(options: {
        type?: string,
        reset?: string,
        cache?: string
    }): Observable<any | null> {
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
        let url = `${this.appConfigService.basePath}/news/${options.type}`;
        return this.http.get(url, httpOptions).pipe(
            switchMap((response: any) => {
                return of(
                    response
                );
            }),
            catchError(error => this.errorService.handleError(error)),
        );
    }

    createUserNews(data): Observable<any | null> {
        let url = `${this.appConfigService.basePath}/create-user-news`;
        this.loaderService.setLoading(true);
        return this.http.post(url,data).pipe(
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
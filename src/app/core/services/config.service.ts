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
        console.log('tagModalViewed', state);
        this.isViewed.next(state);
    }

    getNews(): Observable<any | null> {
        let url = `${this.appConfigService.basePath}/config/news`;
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

    createUserNews(data): Observable<any | null> {
        let url = `${this.appConfigService.basePath}/config/create-user-news`;
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
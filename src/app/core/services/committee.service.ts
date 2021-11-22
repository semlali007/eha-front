import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AppConfigService } from 'src/app/core/services/app-config.service';
import { HttpClient } from '@angular/common/http';
import { catchError, switchMap } from 'rxjs/operators';
import { ErrorService } from './error.service';
import { Committee } from 'src/app/shared/models/committee';

@Injectable({
    providedIn: 'root'
})
export class CommitteeService {
    constructor(
        
        private http: HttpClient,
        private errorService: ErrorService,
        private appConfigService:AppConfigService
    ) { };


    getList(): Observable<any | null> {
        let url = `${this.appConfigService.basePath}/committees`;
        return this.http.get(url).pipe(
            switchMap((response: any) => {
                const commitees : Committee[] = [];
                response.forEach(com => {
                    commitees.push(new Committee({code:com.code, label:com.label}))

                });

                return of(
                    commitees
                );
            }),
            catchError(error => this.errorService.handleError(error)),
        );
    }
}
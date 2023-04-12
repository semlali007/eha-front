import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AppConfigService } from 'src/app/core/services/app-config.service';
import { HttpClient } from '@angular/common/http';
import { catchError, switchMap } from 'rxjs/operators';
import { ErrorService } from './error.service';
import { Category } from 'src/app/shared/models/category';

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    constructor(

        private http: HttpClient,
        private errorService: ErrorService,
        private appConfigService: AppConfigService
    ) { };


    getList(): Observable<any | null> {
        let url = `${this.appConfigService.basePath}/categories`;
        return this.http.get(url).pipe(
            switchMap((response: any) => {
                const categories: Category[] = [];
                response.forEach(com => {
                    categories.push(new Category({ code: com.code, label: com.label }))
                });
                return of(
                    categories
                );
            }),
            catchError(error => this.errorService.handleError(error)),
        );
    }
}
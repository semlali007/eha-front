
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, Observable } from 'rxjs';
import { catchError, finalize, switchMap } from 'rxjs/operators';
import { AppConfigService } from 'src/app/core/services/app-config.service';
import { ErrorService } from './error.service';
import { LoaderService } from './loader.service';

@Injectable({ providedIn: 'root' })
export class FileService {

    constructor(
        private appConfigService: AppConfigService,
        private http: HttpClient,
        private errorService: ErrorService,
        private loaderService: LoaderService,
    ) { }


    export(params: any): Observable<any> {
        const url = `${this.appConfigService.basePath}/sheets/export`;

        this.loaderService.setLoading(true);
        let options: any = {};

        options.search = params.search || { searchText: '', status: '' };

        switch (params.sortBy) {
            case 'date':
                options.order_by = 'created_at';
                break;
            case 'title':
                options.order_by = 'label';
                break;
            default:
                options.order_by = params.sortBy;
                break;
        }

        options.direction = params.sortDirection;

        return this.http.post(url, options)
            .pipe(
                sheetData => sheetData,
                catchError(error => this.errorService.handleError(error)),
                finalize(() => this.loaderService.setLoading(false))
            );
    }

    sheetDocument(params: any): Observable<any> {
        const url = `${this.appConfigService.basePath}/sheets/download`;
        this.loaderService.setLoading(true);
        return this.http.post(url, {file:params.url},{ responseType: 'blob' })
            .pipe(
                sheetData => sheetData,
                catchError(error => this.errorService.handleError(error)),
                finalize(() => this.loaderService.setLoading(false))
            );
    }
}


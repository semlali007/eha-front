import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfigService } from 'src/app/core/services/app-config.service';
import { ErrorService } from './error.service';
import { LoaderService } from './loader.service';
import { tap, catchError, finalize, switchMap } from 'rxjs/operators'; // ajouter switchMap
import { of, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SearchService {
    constructor(
        private appConfigService: AppConfigService,
        private http: HttpClient,
        private errorService: ErrorService,
        private loaderService: LoaderService,
    ) { }

    search(params: any): any {
        const url = `${this.appConfigService.basePath}/search`;
        this.loaderService.setLoading(true);
        return this.http.post(url, params).pipe(
            switchMap((data: any) => {
                return of(
                    this.getSearchDataFromApi(data)
                );
            }),
            catchError(error => this.errorService.handleError(error)),
            finalize(() => this.loaderService.setLoading(false))
        );
    }


    getSearchDataFromApi(dataServer) {
        let types = [
            {
                code: `dauphin`,
                label: 'Dauphin',
            }, {
                code: `contract`,
                label: 'Contrats',
            },
            {
                code: `provider`,
                label: 'Fournisseurs',
            },
            {
                code: `item_generic`,
                label: 'Articles génériques',
            },
            {
                code: `agencies`,
                label: 'Agences',
            },
            {
                code: `tenders`,
                label: 'Affaires',
            }
        ];
        let data = {
            elements: [],
            maxCount: 'dauphin',
            countMax: 0
        };
        let count = 0;
        types.forEach(element => {
            let stats = dataServer.stats ?? {};
            if (!!dataServer[element.code]) {
                let type = dataServer[element.code];
                let items = [];
                type.forEach(item => {
                    items.push({
                        code: item.code || '',
                        label: item.label || '',
                        other: item.other || '',
                        sheet_count: item.sheet_count || '',
                    })

                });

                data.elements.push(
                    {
                        code: element.code,
                        label: element.label,
                        items: items,
                        count: type.length ?? 0,
                        statsDate: !!stats[element.code] ? stats[element.code] : null,
                    }
                );
                if (type.length > count) {
                    count = type.length;
                    data.maxCount = element.code;
                    data.countMax = count;
                }
            }
        });

        return data;
    }
}

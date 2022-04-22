import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from 'src/app/core/services/app-config.service';
import { ErrorService } from './error.service';
import { LoaderService } from './loader.service';
import { catchError, finalize, switchMap } from 'rxjs/operators'; // ajouter switchMap
import { of, Observable } from 'rxjs';
import { Provider } from 'src/app/shared/models/provider';
import { Anchor } from 'src/app/shared/models/anchor';
import { Activity } from 'src/app/shared/models/activity';

@Injectable({
    providedIn: 'root'
})
export class AnchorService {
    private naceCodesURL = 'assets/nace.json';
    constructor(
        private appConfigService: AppConfigService,
        private http: HttpClient,
        private errorService: ErrorService,
        private loaderService: LoaderService,
    ) {
     }

    search(params: any): any {
        const url = `${this.appConfigService.basePath}/search/anchors`;
        this.loaderService.setLoading(true);
        return this.http.post(url, params).pipe(
            switchMap((data: any) => {
                return of(
                    this.getDataFromApi(data)
                );
            }),
            catchError(error => this.errorService.handleError(error)),
            finalize(() => this.loaderService.setLoading(false))
        );
    }

    private getActivitiesForProvider(providerData){
        const activityCodes = ['TP', 'IT', 'PI'];
        let providerActivities = providerData.activities || [];
        const activities = [];
        providerActivities.forEach(activity => {
            let itemActivity = activity.split(':');
            if (activityCodes.includes(itemActivity[0]) && itemActivity[1] >= 1) {
                activities.push(new Activity({
                    code: itemActivity[0],
                    count: itemActivity[1]
                }))
            }
        });
        return activities;

    }
    private getDataFromApi(fields) {
        const activeProviders: Provider[] = [];
        const notActiveProviders: Provider[] = [];

        let itemsProviders = fields.providers ;
        itemsProviders.forEach(data => {
            const provider: Provider = new Provider({
                code: data.provider_code,
                siret: data.provider_siret,
                label: data.provider_label,
                town: data.provider_town,
                zipcode: data.provider_zipcode,
                nace: data.provider_nace,
                distance: data.distance,
                activities: []
            });
            if(!!data.is_active){
                activeProviders.push(provider) ;
            }else {
                notActiveProviders.push(provider);
            }
        });
        return new Anchor(
            {
                status: fields.status,
                message: fields.message,
                maxRadius: fields.maxRadius,
                maxProviders: fields.maxProviders,
                activeProviders: activeProviders,
                notActiveProviders: notActiveProviders,
            }
        );
    }

    getCodes(): Observable<any> {
        return this.http.get(this.naceCodesURL).pipe(
            switchMap((data: any) => {
                return of(data);
            }),
            catchError(error => this.errorService.handleError(error)),
        );
    }
}
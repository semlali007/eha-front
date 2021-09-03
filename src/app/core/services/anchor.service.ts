import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ErrorService } from './error.service';
import { LoaderService } from './loader.service';
import { tap, catchError, finalize, switchMap } from 'rxjs/operators'; // ajouter switchMap
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
        private http: HttpClient,
        private errorService: ErrorService,
        private loaderService: LoaderService,
    ) { }

    search(params: any): any {
        const url = `${environment.api.auth.baseURL}/search/anchors`;
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
        let firstItemProviders = fields.providers[0];
        let secondItemProviders = fields.providers[1];
        
        firstItemProviders.forEach(data => {
            const provider: Provider = new Provider({
                code: data.code,
                siret: data.siret,
                label: data.label,
                town: data.town,
                zipcode: data.zipcode,
                nace: data.nace,
                distance: data.distance,
                activities: this.getActivitiesForProvider(data)
            });
            activeProviders.push(provider);
        });

        secondItemProviders.forEach(data => {
            const provider: Provider = new Provider({
                code: data.code,
                siret: data.siret,
                label: data.label,
                town: data.town,
                zipcode: data.zipcode,
                nace: data.nace,
                distance: data.distance,
                activities: data.activities
            });
            notActiveProviders.push(provider);
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
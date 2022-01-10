import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Subscription } from 'rxjs';
import { timer } from 'rxjs';
import { AppConfigService } from 'src/app/core/services/app-config.service';
@Injectable({
    providedIn: 'root'
})
export class LoaderService  {
    private subscription: Subscription;
    private readonly isLoading: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public readonly isLoading$: Observable<boolean> = this.isLoading.asObservable();

    constructor(
        private appConfigService: AppConfigService,
    ) {
     }

    public setLoading(isLoading: boolean): void {
        const loaderToStart = !!this.appConfigService.appConfig.loaderToStart ? this.appConfigService.appConfig.loaderToStart : 0;
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
       
        if (isLoading == false || loaderToStart <= 0) {
            this.isLoading.next(isLoading);
        } else {
            this.subscription = timer(loaderToStart)
                .subscribe(c => {
                    this.isLoading.next(isLoading);
                }
                );
        }
    }
}
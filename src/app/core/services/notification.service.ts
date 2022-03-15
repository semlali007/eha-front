import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, timer,of } from 'rxjs';
import { take } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from 'src/app/core/services/app-config.service';
import { catchError, switchMap, tap, finalize } from 'rxjs/operators';
import { ErrorService } from './error.service';
import { LoaderService } from './loader.service';
@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private notification: BehaviorSubject<any> = new BehaviorSubject(null);
  public readonly notification$: Observable<any | null> = this.notification.asObservable();

  constructor(private appConfigService: AppConfigService,private http: HttpClient,private loaderService: LoaderService,private errorService: ErrorService) { }

  public showNotification(notification: any): void {
        this.notification.next(notification);
  }

  public closeNotification() {
    this.notification.next(null);
  }

  getUserNotification(options: {
    nni?: string,
  }): Observable<any | null> {
    let url = `${this.appConfigService.basePath}/notifications/list/${options.nni}`;
    return this.http.get(url).pipe(
      switchMap((response: any) => {
        return of(
          response
        );
      }),
      catchError(error => this.errorService.handleError(error)),
    );
}


putViewed(id): Observable<any | null> {
  let url = `${this.appConfigService.basePath}/notifications/update`;
  return this.http.post(url,{id:id}).pipe(
      switchMap((response: any) => {
          return of(
              response
          );
      }),
      catchError(error => this.errorService.handleError(error)),
  );
}
}
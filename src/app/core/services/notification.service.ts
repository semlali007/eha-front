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

  private notification: BehaviorSubject<any | null> = new BehaviorSubject<any | null>(null);
  public readonly notification$: Observable<any | null> = this.notification.asObservable();

  constructor(private appConfigService: AppConfigService,private http: HttpClient,private loaderService: LoaderService,private errorService: ErrorService) { }

  public showNotification(notification: any): void {
        this.notification.next(notification);
  }

  public updateNotification(data: any | null): void {
    this.notification.next(data);
  }

  public closeNotification() {
    this.notification.next(null);
  }

  getUserNotification(options: { nni?: string }): Observable<any | null> {
    const url = `${this.appConfigService.basePath}/notifications/list/${options.nni}`;
    return this.http.get(url).pipe(
      switchMap((response: any) => {
        return response ? response : [];
      }),
      catchError(error => this.errorService.handleError(error))
    );
  }


  putViewed(id): Observable<any | null> {
    const url = `${this.appConfigService.basePath}/notifications/update`;
    return this.http.post(url, { id }).pipe(
      switchMap((response: any) => {
        return response ? response : [];
      }),
      catchError(error => this.errorService.handleError(error))
    );
  }

  putAllViewed(nni): Observable<any | null> {
    const url = `${this.appConfigService.basePath}/notifications/update-all`;
    return this.http.post(url, { nni }).pipe(
      switchMap((response: any) => {
        return response ? response : [];
      }),
      catchError(error => this.errorService.handleError(error))
    );
  }


}
import { Observable, of } from 'rxjs';
import { Injectable, Inject, Optional } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { AppConfigService } from 'src/app/core/services/app-config.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { tap } from 'rxjs/operators';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private appConfigService: AppConfigService,
    private notificationService: NotificationService,
  ) {
  }


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (!this.isMedia(req.url) && req.method !== "GET") {
      req = this.addContentType(req);
    }

    return next.handle(req).pipe(
      tap(stateEvent => {
        if (stateEvent instanceof HttpResponse) {
          if(!!stateEvent.headers && !!stateEvent.headers.get('total_notification')){
            this.notificationService.showNotification({
              category: 'success',
              count: stateEvent.headers.get('total_notification')
            });
          }
        }
      })
    )

   // return next.handle(req);
  }

  private addContentType(request: HttpRequest<any>): HttpRequest<any> {

    return request.clone({
      setHeaders: {
        'Content-Type': 'application/json'
      }
    });
  }

  private isMedia(url: string): boolean {
    return (
       url.includes('migration/save')
      || url.includes('sheets/add')
      || url.includes('sheets/save')
      || url.includes('hotlines/upload')
       || url.includes('websso')
       || url.includes('assets')
       || url.includes('factsheets/upload')
    );
  }

}

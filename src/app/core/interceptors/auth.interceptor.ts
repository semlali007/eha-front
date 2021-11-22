import { Observable } from 'rxjs';
import { Injectable, Inject, Optional } from '@angular/core';
import { OAuthService, OAuthStorage } from 'angular-oauth2-oidc';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authStorage: OAuthStorage,
  ) {
  }


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (!this.isMedia(req.url)) {
      req = this.addContentType(req);
    }

    if (!this.isPublicRequest(req.url)) {
      const token = this.authStorage.getItem('id_token');
      const accessToken = this.authStorage.getItem('access_token');
      const header = 'Bearer ' + token + ' ' + accessToken;
      const headers = req.headers
        .set('Authorization', header);
      req = req.clone({ headers });
    }

    return next.handle(req);
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
    );
  }

  private isPublicRequest(url: string): boolean {
    return  url.includes('websso');
  }

}

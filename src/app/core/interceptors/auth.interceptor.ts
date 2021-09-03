import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (!this.isMedia(request.url)) {
      request = this.addContentType(request);
    }

    return next.handle(request);
  }

  private addContentType(request: HttpRequest<any>): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        'Content-Type': 'application/json'
      }
    });
  }

  private isMedia(url: string): boolean {
    console.log(url);
    return (
       url.includes('migration/save')
      || url.includes('sheets/add')
      || url.includes('sheets/save')
      || url.includes('hotlines/upload')
    );
  }
}
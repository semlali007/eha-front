import { Injectable, NgZone } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  ActivatedRoute,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class HomeResolver implements Resolve<any> {
  constructor() {}

  asyncCheck() {
    return new Promise((resolve, reject) => {
      /* assumed call API for 500ms */
      setTimeout(() => {
        resolve(true);
      }, 500);
    });
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return this.asyncCheck().then((res) => {
      return res;
    });
  }
}

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { filter, switchMap, tap } from 'rxjs/operators';
import { map } from 'rxjs/operators'; 
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,): Observable<boolean|any> {
    return this.authService.user$.pipe(
      map(user => {
        if (!!user && !!user.nni && user.nni.length > 0 && user.status[0] !== 'P') {
          return true;
        } else if (!!user && !!user.nni && user.nni.length > 0 && user.status[0] == 'P') {
          this.router.navigate(['/unauthorized']);
          return false;
        } else {
          this.router.navigate(['/login'], { queryParams: { url: state.url } });
          return false;
        }
      })
    );
  }
}
 

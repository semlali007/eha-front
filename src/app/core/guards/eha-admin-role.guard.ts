import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { CanActivateChild } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EhaAdminRoleGuard implements CanActivate, CanActivateChild {

  constructor(private authService: AuthService) {}

  canActivate(): Observable<boolean> {
    return this.authService.user$.pipe(
      map(user => {
        return !!user && user.hasRole('EHA_ADMIN');
      })
    );
  }

  canActivateChild(): Observable<boolean> {
    return this.canActivate();
   }
}

import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { CanActivateChild } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from 'src/app/core/services/app-config.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EhaAdminRoleGuard implements CanActivate, CanActivateChild {

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient,
    private appConfigService: AppConfigService
  ) {}

  canActivate(): Observable<any> {
    // Vérification backend RÉELLE - ne peut pas être manipulée côté client
    const url = `${this.appConfigService.basePath}/roles/check/EHA_ADMIN`;
    
    return this.http.get<{hasRole: boolean}>(url).pipe(
      map(response => {
        if (response.hasRole) {
          return true;
        } else {
          // Redirection si pas autorisé
          this.router.navigate(['/app/accueil']);
          return false;
        }
      }),
      catchError(() => {
        // En cas d'erreur, bloquer l'accès par sécurité
        this.router.navigate(['/app/accueil']);
        return of(false);
      })
    );
  }

  canActivateChild(): Observable<boolean> {
    return this.canActivate();
  }
}
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CanActivateChild } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from 'src/app/core/services/app-config.service';
import { Observable, of, forkJoin } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EhaGestionnaireRoleGuard implements CanActivate, CanActivateChild {

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient,
    private appConfigService: AppConfigService
  ) {}

  canActivate(): Observable<boolean> {
    // Vérification backend pour EHA_GESTIONNAIRE OU EHA_ADMIN
    const urlGestionnaire = `${this.appConfigService.basePath}/roles/check/EHA_GESTIONNAIRE`;
    const urlAdmin = `${this.appConfigService.basePath}/roles/check/EHA_ADMIN`;
    
    return forkJoin([
      this.http.get<{hasRole: boolean}>(urlGestionnaire),
      this.http.get<{hasRole: boolean}>(urlAdmin)
    ]).pipe(
      map(([gestionnaireResponse, adminResponse]) => {
        const hasAccess = gestionnaireResponse.hasRole || adminResponse.hasRole;
        if (!hasAccess) {
          this.router.navigate(['/app/accueil']);
        }
        return hasAccess;
      }),
      catchError(() => {
        this.router.navigate(['/app/accueil']);
        return of(false);
      })
    );
  }

  canActivateChild(): Observable<boolean> {
    return this.canActivate();
  }
}

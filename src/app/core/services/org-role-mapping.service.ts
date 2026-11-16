import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AppConfigService } from './app-config.service';

/**
 * Interface pour les mappings organisation → rôle
 */
export interface OrgRoleMapping {
  role_name: string;
  role_dc: string;
  role_ou: string;
  description?: string;
}

/**
 * Interface pour la réponse API groupée par organisation
 */
export interface OrgRoleMappingsResponse {
  [organizationCode: string]: OrgRoleMapping[];
}

/**
 * Service Angular pour la gestion des mappings organisation → rôle
 * 
 * Gère le cache et la récupération des mappings depuis l'API backend
 * pour l'attribution automatique de rôles basée sur l'organisation
 * 
 * @author EHA Team
 * @since 2025-08-21
 */
@Injectable({
  providedIn: 'root'
})
export class OrgRoleMappingService {
  
  private mappingsCache: OrgRoleMappingsResponse = {};
  private cacheExpiry: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  
  constructor(
    private http: HttpClient,
    private appConfigService: AppConfigService
  ) { }

  /**
   * Récupère tous les mappings avec système de cache
   * 
   * @returns Observable<OrgRoleMappingsResponse>
   */
  private getMappings(): Observable<OrgRoleMappingsResponse> {
    const now = Date.now();
    
    // Retour du cache si valide
    if (Object.keys(this.mappingsCache).length > 0 && now < this.cacheExpiry) {
      return of(this.mappingsCache);
    }

    const url = `${this.appConfigService.basePath}/org-role-mappings`;
    
    return this.http.get<{success: boolean, data: OrgRoleMappingsResponse}>(url).pipe(
      map(response => {
        if (response.success) {
          this.mappingsCache = response.data;
          this.cacheExpiry = now + this.CACHE_DURATION;
          return this.mappingsCache;
        }
        return {};
      }),
      catchError(error => {
        console.error('Erreur récupération mappings organisation → rôle:', error);
        // En cas d'erreur, retourner le cache existant ou objet vide
        return of(this.mappingsCache || {});
      })
    );
  }

  /**
   * Récupère les rôles à ajouter pour une organisation donnée
   * 
   * @param organizationCode Code de l'organisation
   * @returns Observable<OrgRoleMapping[]>
   */
  getRolesForOrganization(organizationCode: string): Observable<OrgRoleMapping[]> {
    if (!organizationCode) {
      return of([]);
    }

    return this.getMappings().pipe(
      map(mappings => {
        return mappings[organizationCode] || [];
      })
    );
  }

  /**
   * Vérifie si une organisation a des mappings configurés
   * 
   * @param organizationCode Code organisation
   * @returns Observable<boolean>
   */
  hasOrganizationMappings(organizationCode: string): Observable<boolean> {
    return this.getRolesForOrganization(organizationCode).pipe(
      map(roles => roles.length > 0)
    );
  }

  /**
   * Invalide le cache (force le rechargement depuis l'API)
   */
  invalidateCache(): void {
    this.mappingsCache = {};
    this.cacheExpiry = 0;
  }

  /**
   * Récupère les mappings directement depuis l'API (sans cache)
   * Utile pour les tests ou le rafraîchissement forcé
   * 
   * @returns Observable<OrgRoleMappingsResponse>
   */
  refreshMappings(): Observable<OrgRoleMappingsResponse> {
    this.invalidateCache();
    return this.getMappings();
  }

  /**
   * Récupère les statistiques du cache local
   * 
   * @returns Object Informations sur le cache
   */
  getCacheInfo(): any {
    const now = Date.now();
    const isExpired = now >= this.cacheExpiry;
    const organizationsCount = Object.keys(this.mappingsCache).length;
    
    return {
      isExpired,
      organizationsCount,
      cacheExpiry: new Date(this.cacheExpiry),
      remainingTime: Math.max(0, this.cacheExpiry - now)
    };
  }
}

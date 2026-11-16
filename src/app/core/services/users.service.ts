import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { User } from 'src/app/shared/models/user';
import { AppConfigService } from 'src/app/core/services/app-config.service';
import { HttpClient } from '@angular/common/http';
import { Role } from 'src/app/shared/models/role';
import { OrgRoleMappingService } from './org-role-mapping.service';
@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private http: HttpClient,
    private appConfigService: AppConfigService,
    private orgRoleMappingService: OrgRoleMappingService
  ) { }

  get(): Observable<User | null> {
    const url = `${this.appConfigService.basePath}/saml/attributes`;

    return this.http.get(url).pipe(
      switchMap((data: any) => {
        // Récupérer l'organisation de l'utilisateur
        const userOrg = this.getUserOrganization(data);
        
        if (userOrg) {
          // Récupérer les mappings pour cette organisation
          return this.orgRoleMappingService.getRolesForOrganization(userOrg).pipe(
            map(mappings => this.getUser(data, mappings))
          );
        } else {
          // Pas d'organisation, traitement normal
          return of(this.getUser(data, []));
        }
      })
    );
  }
  /**
   * Extrait le code organisation depuis les attributs SAML (department)
   * 
   * @param params Attributs SAML
   * @returns Code organisation ou null
   */
  private getUserOrganization(params: any): string | null {
    const userDepartment = params.gardianwebsso_department;
    
    if (Array.isArray(userDepartment) && userDepartment.length > 0) {
      return this.extractOrgCodeFromDepartment(userDepartment[0]);
    } else if (typeof userDepartment === 'string') {
      return this.extractOrgCodeFromDepartment(userDepartment);
    }
    
    return null;
  }

  /**
   * Extrait le code d'organisation depuis le chemin department
   * Exemple: "/EDF/9651/9803/9708/9708-3/6217M/621727/62172702" → "621727"
   * 
   * @param departmentPath Chemin du département
   * @returns Code d'organisation (position 6) ou null
   */
  private extractOrgCodeFromDepartment(departmentPath: string): string | null {
    if (!departmentPath || typeof departmentPath !== 'string') {
      return null;
    }
    
    // Diviser le chemin par "/"
    const segments = departmentPath.split('/').filter(segment => segment.length > 0);
    
    // Prendre le segment à la position 6 (7ème élément)
    if (segments.length > 6) {
      return segments[6];
    }
    
    return null;
  }

  /**
   * Construit l'objet User avec attribution automatique de rôles
   * 
   * @param params Attributs SAML
   * @param orgMappings Mappings organisation → rôle depuis la BDD
   * @returns Objet User complet
   */
  private getUser(params: any, orgMappings: any[] = []): User {
    const roles: Role[] = [];
    
    // 1. Parser les rôles SAML existants
    if (!!params.gardianwebsso_ismemberof) {
      params.gardianwebsso_ismemberof.forEach(data => {
        let roleArray = [];
        data.split(",").forEach(r => {
          let tt = r.split("=");
          roleArray[tt[0]] = tt[1];
        });
        
        const role: Role = new Role({
          name: roleArray['cn'],
          dc: roleArray['dc'],
          ou: roleArray['ou'],
        });
        roles.push(role);
      });
    }

    // 2. Ajouter les rôles basés sur l'organisation (depuis la BDD)
    if (orgMappings.length > 0) {
      orgMappings.forEach(mapping => {
        // Vérifier que le rôle n'existe pas déjà
        const existingRole = roles.find(role => role.name === mapping.role_name);
        
        if (!existingRole) {
          const additionalRole = new Role({
            name: mapping.role_name,
            dc: mapping.role_dc,
            ou: mapping.role_ou,
          });
          roles.push(additionalRole);
        }
      });
    }

    return new User({
      email: params.gardianwebsso_email || '',
      nni: params.gardianwebsso_groupid,
      name: params.gardianwebsso_cn,
      direction: params.gardianwebsso_department,
      roles: roles,
      id: params.gardianwebsso_id,
      status: params.gardianwebsso_status
    });
  }

}

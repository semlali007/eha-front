import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from 'src/app/shared/models/user';
import { AppConfigService } from 'src/app/core/services/app-config.service';
import { HttpClient } from '@angular/common/http';
import { Role } from 'src/app/shared/models/role';
@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private http: HttpClient,
    private appConfigService: AppConfigService,
  ) { }

  get(): Observable<User | null> {
    const url = `${this.appConfigService.basePath}/saml/attributes`;

    return this.http.get(url).pipe(
      switchMap((data: any) => {
        console.log('data', data)
        return of(this.getUser(data));
      })
    );
  }
  private getUser(params): User {
    const roles: Role[] = [];
    if (!!params.gardianwebsso_ismemberof) {
      params.gardianwebsso_ismemberof.forEach(data => {
        let roleArray = [];
        data.split(",").forEach(r => {
          let tt = r.split("=");
          roleArray[tt[0]] = tt[1];
        }
        )
        const role: Role = new Role({
          name: roleArray['cn'],
          dc: roleArray['dc'],
          ou: roleArray['ou'],
        });
        roles.push(role);
      });
    }
    console.log('email', params.gardianwebsso_email)

    return new User({
      email: params.gardianwebsso_email || 'cedric-externe.simou-nono@edf.fr',
      nni: params.gardianwebsso_groupid,
      name: params.gardianwebsso_cn,
      direction: params.gardianwebsso_department,
      roles: roles,
      id: params.gardianwebsso_id
    });
  }

}

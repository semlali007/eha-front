import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { LoaderService } from 'src/app/core/services/loader.service';
import { switchMap, tap, catchError, finalize, delay } from 'rxjs/operators';
import { User } from 'src/app/shared/models/user';
import { AppConfigService } from 'src/app/core/services/app-config.service';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { ErrorService } from './error.service';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private http: HttpClient,
    private appConfigService: AppConfigService,
    ) { }

  get(nni: string): Observable<User | null> {
    const url = `${this.appConfigService.basePath}/user.php?action=details&nni=${nni}`;

    return this.http.get(url).pipe(
      switchMap((data: any) => {

        const nni: string = data.data.nni;
        const direction: string = data.data.direction;
        let roles = [];
        data.data.roles.forEach(role => {
          roles.push(role);
        });
        let params = {
          nni: nni,
          direction: direction,
          email: data.data.email,
          roles: roles
        }

        return of(this.getUser(params));
      })
    );
  }

  private getUser(params): User {
    return new User({
      email: params.email,
      nni: params.nni,
      name: params.name,
      direction: params.direction,
      roles: params.roles,
    });
  }

}

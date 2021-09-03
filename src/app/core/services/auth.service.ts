import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { switchMap, tap, catchError, finalize, delay } from 'rxjs/operators';
import { User } from 'src/app/shared/models/user';
import { environment } from '../../../environments/environment';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { ErrorService } from './error.service';
import { LoaderService } from './loader.service';
import { Router } from '@angular/router';
import { ToastrService } from './toastr.service';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private errors: any = {
    '101': "La connexion LDAP a échoué.",
    '102': "Echec de l'authentification sur GARDIAN SESAME avec le compte technique.",
    '103': "Mot de passe SESAME vérouillé.",
    '104': "Le compte utilisateur n'a pas été trouvé dans l'annuaire.",
    '105': "Le DN de l'utilisateur n'est pas valide. Contacter l'administrateur.",
    '106': "Identifiant incorrect ou mot de passe SESAME expiré.",
    '107': "Erreur inconnue.",
    '108': "Cet utilisateur n'existe pas.",
    '109': "Vos identifiants sont corrects, néanmoins vous êtes identifés comme externe, votre accès à cette application est donc refusé.",
    '110': "Votre dérogation pour accéder à ce site n'est plus valable, merci d'en demander une nouvelle.",
    'logout': "Votre demande de déconnexion a été transmise."
  };

  private user: BehaviorSubject<User | null> = new BehaviorSubject(null);
  public readonly user$: Observable<User | null> = this.user.asObservable();
  constructor(private http: HttpClient,
    private loaderService: LoaderService,
    private errorService: ErrorService,
    private router: Router,
    private toastrService: ToastrService,
  ) { }
  public login(nni: string, password: string): Observable<User | null> {
    this.loaderService.setLoading(true);
    const url = `${environment.api.auth.baseURL}/authentication/login`;

    const data = {
      nni: nni,
      pwd: password
    };


    this.loaderService.setLoading(true);
    return this.http.post<User>(url, data).pipe(
      switchMap((data: any) => {
        if (data.logged == true) {
          const nni: string = data.data.nni;
          const direction: string = data.data.direction;
          const userData: string = data.data;
          let roles = [];
          data.data.roles.forEach(role => {
            roles.push(role);
          });
          let params = {
            nni: nni,
            userDatat: userData,
            direction: direction,
            email: data.data.email,
            roles: roles
          }
          this.saveAuthData(params);
          return of(this.getUser(params));
        } else {
          if (this.errors[data.status] === undefined) {
            throw "Une erreur est survenue, mais alors laquelle...";
          } else {
            throw this.errors[data.status];
          }
        }

      }),
      tap(user => this.user.next(user)),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
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

  public logout(): Observable<any | null> {
    this.loaderService.setLoading(true);
    const url = `${environment.api.auth.baseURL}/authentication/logout`;

    return this.http.get(url).pipe(
      switchMap((response: any) => {
        if (response.logged === false) {
          localStorage.removeItem('expirationDate');
          localStorage.removeItem('data');
          localStorage.removeItem('nni');
          localStorage.removeItem('email');
          localStorage.removeItem('direction');
          return of({});
        } else {
          throw "Vous ne devriez pas voir ce message.";
        }
      }),
      tap(_ => this.toastrService.showToastr({
        category: 'success',
        message: 'Vous a été correctement déconnecté.'
      })),
      tap(user => this.user.next(null)),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );
  }


  private saveAuthData(params) {
    const now = new Date();
    const expirationDate = (now.getTime() + 3600 * 1000).toString();
    localStorage.setItem('expirationDate', expirationDate);
    localStorage.setItem('nni', params.nni);
    localStorage.setItem('data', params.data);
    localStorage.setItem('direction', params.direction);
    localStorage.setItem('email', params.email);
  }

  public autoLogin(user: User) {
    this.user.next(user);
    this.router.navigate(['app/accueil']);
  }

  get currentUser(): User {
    return this.user.getValue();
  }
}

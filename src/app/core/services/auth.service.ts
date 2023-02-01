/* eslint-disable brace-style */
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable, ReplaySubject, of } from 'rxjs';
import { filter, map, switchMap, tap, catchError, finalize, delay } from 'rxjs/operators';
import { User } from 'src/app/shared/models/user';
import { ErrorService } from 'src/app/core/services/error.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { ToastrService } from 'src/app/core/services/toastr.service';
import { Profil } from 'src/app/shared/models/profil';
import { Role } from 'src/app/shared/models/role';
import { MessageService } from './message.service';
import { NGXLogger } from "ngx-logger";

@Injectable({ providedIn: 'root' })
export class AuthService {

  private user: BehaviorSubject<User | null> = new BehaviorSubject(null);
  public readonly user$: Observable<User | null> = this.user.asObservable();
  private isAuthenticatedSubject$ = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject$.asObservable();

  private isDoneLoadingSubject$ = new ReplaySubject<boolean>();
  public isDoneLoading$ = this.isDoneLoadingSubject$.asObservable();

  /**
   * Publishes `true` if and only if (a) all the asynchronous initial
   * login calls have completed or errorred, and (b) the user ended up
   * being authenticated.
   *
   * In essence, it combines:
   *
   * - the latest known state of whether the user is authorized
   * - whether the ajax calls for initial log in have all been done
   */
  public canActivateProtectedRoutes$: Observable<boolean> = combineLatest([
    this.isAuthenticated$,
    this.isDoneLoading$
  ]).pipe(map(values => values.every(b => b)));

  private navigateToLoginPage() {
    // TODO: Remember current URL
    this.router.navigateByUrl('/login');
  }

  constructor(
    private loaderService: LoaderService,
    private errorService: ErrorService,
    private messageService: MessageService,
    private router: Router,
    private logger: NGXLogger
  ) {


    // This is tricky, as it might cause race conditions (where access_token is set in another
    // tab before everything is said and done there.
    // TODO: Improve this setup. See: https://github.com/jeroenheijmans/sample-angular-oauth2-oidc-with-auth-guards/issues/2
    window.addEventListener('storage', (event) => {
      console.log('storage', event);
      // The `key` is `null` if the event was caused by `.clear()`
      if (event.key !== 'access_token' && event.key !== null) {
        return;
      }

      console.warn('Noticed changes to access_token (most likely from another tab), updating isAuthenticated');

     
    });
  }



  public login(targetUrl?: string) {
    // Note: before version 9.1.0 of the library you needed to
    // call encodeURIComponent on the argument to the method.
    let url = this.router.url;
    
    if('/login' == this.router.url || '/logout' == this.router.url){
      url = '/app/accueil';
    }

  }


  // These normally won't be exposed from a service like this, but
  // for debugging it makes sense.
  private getUser(params): User {

    return new User({
      email:  'it_front@supportdag.edf.fr',
      nni: 'WID03C5N',
      name: 'Walid',
      direction: 'TEST',
      roles: [],
    });

   /* return new User({
      email: params.profil.email || 'it_front@supportdag.edf.fr',
      nni: params.nni,
      name: params.profil.name,
      direction: params.profil.direction,
      roles: params.profil.roles,
      profil: new Profil(params.profil)
    });*/
  }

  get currentUser(): User {
    return this.user.getValue();
  }

  public setCookie(params: any) {
    let d: Date = new Date();
    d.setTime(
      d.getTime() +
        (params.expireDays ? params.expireDays : 1) * 24 * 60 * 60 * 1000
    );
    document.cookie =
      (params.name ? params.name : '') +
      '=' +
      (params.value ? params.value : '') +
      ';' +
      (params.session && params.session == true
        ? ''
        : 'expires=' + d.toUTCString() + ';') +
      'path=' +
      (params.path && params.path.length > 0 ? params.path : '/') +
      ';' +
      (location.protocol === 'https:' && params.secure && params.secure == true
        ? 'secure'
        : '');
  }

  public getCookie(name: string) {
    
    let ca: Array<string> = document.cookie.split(';');
    let caLen: number = ca.length;
    let cookieName = `${name}=`;
    let c: string;

    for (let i: number = 0; i < caLen; i += 1) {
      c = ca[i].replace(/^\s+/g, '');
      if (c.indexOf(cookieName) == 0) {
        return c.substring(cookieName.length, c.length);
      }
    }
    return '';
  }
  public deleteCookie(cookieName) {
    this.setCookie({ name: cookieName, value: '', expireDays: -1 });
  }

  public autoLogin(user: User) {
    this.user.next(user);
    this.router.navigate(['app/accueil']);
  }

  
  public autoLogin1(dt?: any) {
    let c1 =
    {
      name: 'SimpleSAML',
      value: '6f9o1k00ab5dipdd44u83f518r',
      session: true,
      path: '/',
      secure: true,
      protocol: 'https:',
    };
    let c2 =
    {
      name: 'SimpleSAMLAuthToken',
      value: '_5b09c8ada8357b28178507cca3f72a5ed4c5620c2e',
      session: true,
      path: '/',
      secure: true,
      protocol: 'https:',
    };
    this.setCookie(c2);
    this.setCookie(c1);
    
    console.log('SimpleSAMLAuthToken:', this.getCookie('SimpleSAMLAuthToken'));
    console.log('SimpleSAML:', this.getCookie('SimpleSAML'));

    this.user.next(this.getUser({
      nni: 'WID03C5N',
      profil: {}
    }));
  }


}


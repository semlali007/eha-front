/* eslint-disable brace-style */
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthErrorEvent, OAuthService } from 'angular-oauth2-oidc';
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
    private oauthService: OAuthService,
    private messageService: MessageService,
    private router: Router,
    private logger: NGXLogger
  ) {
    // Useful for debugging:
    this.oauthService.events.subscribe(event => {
      
      if (event instanceof OAuthErrorEvent) {
        console.error('OAuthErrorEvent Object:', event);
      } else {
        console.warn('OAuthEvent Object:', event);
      }
    });

    // This is tricky, as it might cause race conditions (where access_token is set in another
    // tab before everything is said and done there.
    // TODO: Improve this setup. See: https://github.com/jeroenheijmans/sample-angular-oauth2-oidc-with-auth-guards/issues/2
    window.addEventListener('storage', (event) => {
      // The `key` is `null` if the event was caused by `.clear()`
      if (event.key !== 'access_token' && event.key !== null) {
        return;
      }

      console.warn('Noticed changes to access_token (most likely from another tab), updating isAuthenticated');
      this.isAuthenticatedSubject$.next(this.oauthService.hasValidAccessToken());

      if (!this.oauthService.hasValidAccessToken()) {
        this.navigateToLoginPage();
      }
    });

    this.oauthService.events
      .subscribe(_ => {
        this.isAuthenticatedSubject$.next(this.oauthService.hasValidAccessToken());
      });

    this.oauthService.events
      .pipe(filter(e => ['token_received'].includes(e.type)))
      .subscribe(e => this.oauthService.loadUserProfile().then((data) =>
      {
        this.logger.error("loadUserProfile: " + JSON.stringify(data));
        this.autoLogin(data);
      }

      ));

    this.oauthService.events
      .pipe(filter(e => ['session_terminated', 'session_error'].includes(e.type)))
      .subscribe(e => this.navigateToLoginPage());
    this.oauthService.setupAutomaticSilentRefresh();
  }

  public runInitialLoginSequence(): Promise<void> {
    
    return this.oauthService.loadDiscoveryDocument()
    .then(() => new Promise<void>(resolve => setTimeout(() => resolve(), 1500)))
      .then(() => this.oauthService.tryLogin())
      
      .then(() => {
        if (this.oauthService.hasValidAccessToken()) {
          return Promise.resolve();
        }
      })
      .then(() => {
        this.isDoneLoadingSubject$.next(true);
        if (this.oauthService.state && this.oauthService.state !== 'undefined' && this.oauthService.state !== 'null') {
         let newStr = this.oauthService.state;
         let stateUrl = newStr.replace(/w_t_p/g,'/');
          if (stateUrl.startsWith('/') === false) {
            stateUrl = decodeURIComponent(stateUrl);
          }
         if(stateUrl == '/app/accueil'){
           this.messageService.sendMessage({modalStateHome:true});
         }
         
         this.router.navigateByUrl(stateUrl);
        }
      })
      .catch(() => this.isDoneLoadingSubject$.next(true));
  }

  public login(targetUrl?: string) {
    // Note: before version 9.1.0 of the library you needed to
    // call encodeURIComponent on the argument to the method.
    let url = this.router.url;
    
    if('/login' == this.router.url || '/logout' == this.router.url){
      url = '/app/accueil';
    }

    this.oauthService.initCodeFlow(targetUrl || url, { 'acr_values': 'sesameGROUPE' });
  }

  public logout() { this.oauthService.logOut(true); }
  public refresh() { this.oauthService.silentRefresh(); }
  public hasValidToken() { return this.oauthService.hasValidAccessToken(); }
  public revokeTokenAndLogout() {
    this.oauthService.revokeTokenAndLogout({
      client_id: this.oauthService.clientId,
      returnTo: this.oauthService.postLogoutRedirectUri
    }, false);
  }

  // These normally won't be exposed from a service like this, but
  // for debugging it makes sense.
  public get accessToken() { return this.oauthService.getAccessToken(); }
  public get refreshToken() { return this.oauthService.getRefreshToken(); }
  public get identityClaims() { return this.oauthService.getIdentityClaims(); }
  public get idToken() { return this.oauthService.getIdToken(); }
  public get logoutUrl() { return this.oauthService.logoutUrl; }
  public stopAutomaticRefresh() { return this.oauthService.stopAutomaticRefresh(); }
  private getUser(params): User {
    return new User({
      email: params.profil.email || 'it@supportdag.edf.fr',
      nni: params.nni,
      name: params.profil.name,
      direction: params.profil.direction,
      roles: params.profil.roles,
      profil: new Profil(params.profil)
    });
  }

  get currentUser(): User {
    return this.user.getValue();
  }

  public autoLogin(dt?: any) {
    if (this.oauthService.hasValidAccessToken()) {
      let params = this.identityClaims;
      const roles: Role[] = [];
      if (!!params['isMemberOf']) {
        params['isMemberOf'].forEach(data => {
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
      
      params['roles'] = roles;
      this.user.next(this.getUser({
        nni: params['sub'],
        profil: params
      }));
    }
  }

  public tryLogin() {
    this.oauthService.tryLogin()
  }
}


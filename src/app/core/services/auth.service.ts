import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from 'src/app/shared/models/user';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private user: BehaviorSubject<User | null> = new BehaviorSubject(null);
  public readonly user$: Observable<User | null> = this.user.asObservable();
  private isAuthenticatedSubject$ = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject$.asObservable();

  private isDoneLoadingSubject$ = new ReplaySubject<boolean>();
  public isDoneLoading$ = this.isDoneLoadingSubject$.asObservable();

  public canActivateProtectedRoutes$: Observable<boolean> = combineLatest([
    this.isAuthenticated$,
    this.isDoneLoading$
  ]).pipe(map(values => values.every(b => b)));

  private navigateToLoginPage() {
    this.router.navigateByUrl('/login');
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {

  }

  public login(targetUrl?: string) {
    let destUrl = "/api/saml/login";
    let url = this.router.url;
    if ('/login' == this.router.url || '/logout' == this.router.url) {
      if (this.user.getValue() && this.user.getValue().status === 'P') {
        console.error("Accès non autorisé : statut 'P'");
        return; // Quitte la fonction sans effectuer de redirection
      } else {
        url = '/app/accueil';
      }
    }
    
    destUrl += '/' + encodeURIComponent(targetUrl || url);
    window.location.href = destUrl;
  }

  get currentUser(): User {
    return this.user.getValue();
  }

  public autoLogin(user: User) {
    this.user.next(user);
  }

}


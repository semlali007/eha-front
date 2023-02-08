import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
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
  ) {

  }

  public login(targetUrl?: string) {
    let url = this.router.url;
    if ('/login' == this.router.url || '/logout' == this.router.url) {
      url = '/app/accueil';
    }
  }

  get currentUser(): User {
    return this.user.getValue();
  }

  public autoLogin(user: User) {
    this.user.next(user);
    this.router.navigate(['app/accueil']);
  }

}


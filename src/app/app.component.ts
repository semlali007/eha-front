import { Component, OnInit } from '@angular/core';
import { Observable, filter, map } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { UsersService } from 'src/app/core/services/users.service';
import { Browser } from 'src/app/core/services/browser.service';
import { MatomoTracker, MatomoInjector } from 'ngx-matomo';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { AppConfigService } from 'src/app/core/services/app-config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  user$: Observable<any>;
  currentRoute: string;
  constructor(
    private authService: AuthService,
    private browser: Browser,
    private matomoTracker: MatomoTracker,
    private matomoInjector: MatomoInjector,
    private router: Router,
    private config: AppConfigService,
    private usersService: UsersService,
  ) {
  }

  ngOnInit(): void {
    // Initialiser Matomo avant de l'utiliser
    try {
      this.matomoInjector.init(this.config.appConfig.padaoneURL || 'https://padaone-ux.edf.fr/', this.config.appConfig.padaoneSiteId || 156);
    } catch (error) {
      console.warn('Matomo initialization failed:', error);
    }
    
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let route: ActivatedRoute = this.router.routerState.root;
          let routeTitle = '';
          while (route!.firstChild) {
            route = route.firstChild;
          }
          if (route.snapshot.data['title']) {
            routeTitle = route!.snapshot.data['title'];
          }

          return {
            title: routeTitle,
            url: this.router.url
          }
        })
      )
      .subscribe((route: any) => {
        if (!!route && !!route.title) {
          this.matomoTracker.setCustomUrl(route.url);
          this.matomoTracker.setDocumentTitle(route.title);
          this.matomoTracker.trackPageView();
        }
      });
    this.browser.checkIfFirefox();
    this.tryAutoLogin();
    this.user$ = this.authService.user$;
  }

  private tryAutoLogin() {
    this.usersService.get().subscribe(user => {
      this.authService.autoLogin(user);
    });
  }

}

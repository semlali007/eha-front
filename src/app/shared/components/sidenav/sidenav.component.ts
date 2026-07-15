import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../models/user';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: [
    './sidenav.component.css',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class SidenavComponent implements OnInit, OnDestroy {
  public prefix = 'admin';
  public dashboardPath = `${this.prefix}/dashboard`;
  public administratorPath = `${this.prefix}/administrator`;
  public externalPath = `${this.prefix}/external`;
  public hotlineThemePath = `${this.prefix}/hotline-theme`;
  public hotlineGroupPath = `${this.prefix}/hotline-group`;
  public hotlineEmailPath = `${this.prefix}/hotline-email`;
  public documentationPath = `${this.prefix}/documentation/0`;
  public importPath = `${this.prefix}/import`;
  public migrationDapiPath = `${this.prefix}/migration/dapi`;
  public migrationDaitPath = `${this.prefix}/migration/dait`;
  public migrationDatpPath = `${this.prefix}/migration/datp`;
  public newsPath = `${this.prefix}/news/after-connexion`;
  public sheetPage = `${this.prefix}/page/sheet-modal-news`;
  public purchasePage = `${this.prefix}/page/purchase-modal-news`;
  public informationPath = `${this.prefix}/news/home-page`;
  public welcomeTextPath = `${this.prefix}/page/welcome-text`;
  public filePath = `${this.prefix}/fiche-pratique/list`;
  public logsPath = `${this.prefix}/recherche/logs`;
  public blackListWordsPath = `${this.prefix}/recherche/mots-ignorer`;
  public whiteListWordsPath = `${this.prefix}/recherche/mots-associer`;
  public searchedWordsPath = `${this.prefix}/recherche/mots-rechercher`;
  public newsCastPath = `${this.prefix}/actualites`;
  public newsCastHomePath = `${this.prefix}/actualites/accueil`;
  public contactPath = `${this.prefix}/page/contact`;
  public satisfactionPath = `${this.prefix}/satisfactions`;
  public hlkSyncPath = `${this.prefix}/hlk-sync`;

  public subscription!: Subscription;
  public user: User | null = null;
  public isDropup = true;

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.subscription = this.authService.user$.subscribe(user => this.user = user);
  }

  public navigate(page: string): void {
    this.router.navigate([page]);
  }

  public isActive(page: string): boolean {
    return this.router.isActive(page, true);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

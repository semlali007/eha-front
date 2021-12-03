import { APP_INITIALIZER, ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { PublicModule } from '../public/public.module';
import { ProtectedModule } from '../protected/protected.module';
import { AdministrationModule } from '../administration/administration.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BannerComponent } from './components/banner/banner.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { LoaderComponent } from './components/loader/loader.component';
import { ToastrComponent } from './components/toastr/toastr.component';
import { ModalInfoComponent } from './components/modal-info/modal-info.component';
import { AlertModule } from 'ngx-bootstrap/alert';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { CacheInterceptor } from './interceptors/cache.interceptor';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { AuthConfig, OAuthModule, OAuthService, OAuthStorage } from 'angular-oauth2-oidc';
import { AuthGuardWithForcedLogin } from './guards/auth-guard-with-forced-login.service';
import { AuthGuard } from './guards/auth-guard.service';
import { AuthService } from './services/auth.service';
import { getAuthConfig } from  './config/auth-config-factory';
import { AppConfigService } from './services/app-config.service';
export function storageFactory(): OAuthStorage {
  return localStorage;
}

@NgModule({
  declarations: [BannerComponent, NavbarComponent, FooterComponent, LoaderComponent, ModalInfoComponent, ToastrComponent, PageNotFoundComponent],
  imports: [
    SharedModule,
    PublicModule,
    ProtectedModule,
    AdministrationModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AlertModule.forRoot(),
    OAuthModule.forRoot(),
  ],
  exports: [BannerComponent, NavbarComponent, FooterComponent, LoaderComponent, ModalInfoComponent, ToastrComponent, PageNotFoundComponent],
  providers: [
    AppConfigService,
    AuthService,
    AuthGuard,
    AuthGuardWithForcedLogin,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CacheInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    { provide: APP_INITIALIZER, useFactory: getAuthConfig, deps: [HttpClient, OAuthService, AppConfigService], multi: true },
    { provide: OAuthStorage, useFactory: storageFactory },
  ]
})

export class CoreModule {
  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [
      ]
    };
  }

  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded.');
    }
  }
}

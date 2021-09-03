import { NgModule, Optional, SkipSelf } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { PublicModule } from '../public/public.module';
import { ProtectedModule } from '../protected/protected.module';
import { AdministrationModule } from '../administration/administration.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BannerComponent } from './components/banner/banner.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
import { LoaderComponent } from './components/loader/loader.component';
import { ToastrComponent } from './components/toastr/toastr.component';
import { AlertModule } from 'ngx-bootstrap/alert';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { CacheInterceptor } from './interceptors/cache.interceptor';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

@NgModule({
  declarations: [BannerComponent, NavbarComponent, FooterComponent, LoaderComponent, ToastrComponent, PageNotFoundComponent],
  imports: [
    SharedModule,
    PublicModule,
    ProtectedModule,
    AdministrationModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AlertModule.forRoot(),
  ],
  exports: [BannerComponent, NavbarComponent, FooterComponent, LoaderComponent, ToastrComponent, PageNotFoundComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CacheInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
})

export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded.');
    }
  }
}

import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { HomeComponent } from './home/home.component';
import { HomeDocumentationComponent } from './home-documentation/home-documentation.component';
import { HomeSearchComponent } from './home-search/home-search.component';
import { HomeContactComponent } from './home-contact/home-contact.component';
import { HomeSearchFormComponent } from './home-search-form/home-search-form.component';
import { HomeSearchFormZipComponent } from './home-search-form-zip/home-search-form-zip.component';
import { HomeRoutingModule } from './home-routing.module';


@NgModule({
  declarations: [HomeComponent, HomeDocumentationComponent, HomeSearchComponent, HomeContactComponent, HomeSearchFormComponent, HomeSearchFormZipComponent],
  imports: [
    SharedModule,
    HomeRoutingModule
  ]
})
export class HomeModule { }

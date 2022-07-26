import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { HomeComponent } from './home/home.component';
import { HomeDocumentationComponent } from './home-documentation/home-documentation.component';
import { HomeSearchComponent } from './home-search/home-search.component';
import { HomeContactComponent } from './home-contact/home-contact.component';
import { HomeSearchFormComponent } from './home-search-form/home-search-form.component';
import { HomeSheetComponent } from './home-sheet/home-sheet.component';
import { HomePurchaseFormComponent } from './home-purchase-form/home-purchase-form.component';
import { HomeSearchFormZipComponent } from './home-search-form-zip/home-search-form-zip.component';
import { HomeRoutingModule } from './home-routing.module';
import { HomeModalComponent } from './home-modal/home-modal.component';
import { HomeInformationComponent } from './home-information/home-information.component';
import { ConfigService } from 'src/app/core/services/config.service';


@NgModule({
  declarations: [HomeComponent, HomeDocumentationComponent, HomeSearchComponent, HomeContactComponent, HomeSearchFormComponent,HomeSheetComponent, HomeSearchFormZipComponent, HomeModalComponent, HomeInformationComponent, HomePurchaseFormComponent],
  imports: [
    SharedModule,
    HomeRoutingModule
  ],
  providers: [
    ConfigService
  ]
})
export class HomeModule { }

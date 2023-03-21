import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { NcFormComponent } from './nc-form.component';
import { NcFormDateComponent } from './nc-form-date/nc-form-date.component';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { frLocale } from 'ngx-bootstrap/locale';
import { NcFormDescriptionComponent } from './nc-form-description/nc-form-description.component';
import { NcFormShortComponent } from './nc-form-short/nc-form-short.component';
import { NcFormTitleComponent } from './nc-form-title/nc-form-title.component';
import { NcFormCategoryComponent } from './nc-form-category/nc-form-category.component';
import { NcFormStatusComponent } from './nc-form-status/nc-form-status.component';
import { NcFormHomeComponent } from './nc-form-home/nc-form-home.component';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';

defineLocale('fr', frLocale);
@NgModule({
  declarations: [
    NcFormComponent,
    NcFormDateComponent,
    NcFormDescriptionComponent,
    NcFormShortComponent,
    NcFormTitleComponent,
    NcFormCategoryComponent,
    NcFormStatusComponent,
    NcFormHomeComponent
  ],
  imports: [
    SharedModule,
    FormsModule,
    ModalModule.forRoot()
  ],
  exports: [
    NcFormComponent
  ],
  providers: []
})
export class NcSharedModule { }

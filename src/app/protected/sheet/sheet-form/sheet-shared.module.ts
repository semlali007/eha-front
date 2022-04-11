import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { SheetFormComponent } from './sheet-form.component';
import { SheetFormDateComponent } from './sheet-form-date/sheet-form-date.component';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { frLocale } from 'ngx-bootstrap/locale';
import { SheetFormContractsComponent } from './sheet-form-contracts/sheet-form-contracts.component';
import { SheetFormContractsItemComponent } from './sheet-form-contracts-item/sheet-form-contracts-item.component';
import { SheetFormContractsAddComponent } from './sheet-form-contracts-add/sheet-form-contracts-add.component';
import { SheetFormCommentsComponent } from './sheet-form-comments/sheet-form-comments.component';
import { SheetFormContentComponent } from './sheet-form-content/sheet-form-content.component';
import { SheetFormLotsComponent } from './sheet-form-lots/sheet-form-lots.component';
import { SheetFormLotsItemComponent } from './sheet-form-lots-item/sheet-form-lots-item.component';
import { SheetFormLotsAddComponent } from './sheet-form-lots-add/sheet-form-lots-add.component';
import { SheetFormTitleComponent } from './sheet-form-title/sheet-form-title.component';
import { SheetFormKitComponent } from './sheet-form-kit/sheet-form-kit.component';
import { SheetFormProvidersComponent } from './sheet-form-providers/sheet-form-providers.component';
import { SheetFormDauphinComponent } from './sheet-form-dauphin/sheet-form-dauphin.component';
import { SheetFormEdfOpenComponent } from './sheet-form-edf-open/sheet-form-edf-open.component';
import { SheetFormStipulationComponent } from './sheet-form-stipulation/sheet-form-stipulation.component';
import { SheetFormPartnershipComponent } from './sheet-form-partnership/sheet-form-partnership.component';
import { SheetFormProtectedSectorComponent } from './sheet-form-protected-sector/sheet-form-protected-sector.component';
import { SheetFormModalComponent } from './sheet-form-modal/sheet-form-modal.component';
import { SheetFormBeneficiariesComponent } from './sheet-form-beneficiaries/sheet-form-beneficiaries.component';
import { SheetFormAreasComponent } from './sheet-form-areas/sheet-form-areas.component';
import { SheetFormDirectionsComponent } from './sheet-form-directions/sheet-form-directions.component';
import { SheetFormStatusComponent } from './sheet-form-status/sheet-form-status.component';
import { SheetFormCommitteeComponent } from './sheet-form-committee/sheet-form-committee.component';
import { SheetFormShowcaseComponent } from './sheet-form-showcase/sheet-form-showcase.component';
import { SheetFormOptionsComponent } from './sheet-form-options/sheet-form-options.component';
import { SheetFormOptionsAddComponent } from './sheet-form-options-add/sheet-form-options-add.component';
import { SheetFormOptionsItemComponent } from './sheet-form-options-item/sheet-form-options-item.component';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';

defineLocale('fr', frLocale);
@NgModule({
  declarations: [
    SheetFormComponent,
    SheetFormDateComponent,
    SheetFormContractsComponent,
    SheetFormContractsItemComponent,
    SheetFormContractsAddComponent,
    SheetFormCommentsComponent,
    SheetFormContentComponent,
    SheetFormLotsComponent,
    SheetFormLotsItemComponent,
    SheetFormLotsAddComponent,
    SheetFormTitleComponent,
    SheetFormKitComponent,
    SheetFormProvidersComponent,
    SheetFormDauphinComponent,
    SheetFormEdfOpenComponent,
    SheetFormStipulationComponent,
    SheetFormPartnershipComponent,
    SheetFormProtectedSectorComponent,
    SheetFormModalComponent,
    SheetFormBeneficiariesComponent,
    SheetFormAreasComponent,
    SheetFormDirectionsComponent,
    SheetFormStatusComponent,
    SheetFormCommitteeComponent,
    SheetFormShowcaseComponent,
    SheetFormOptionsComponent,
    SheetFormOptionsAddComponent,
    SheetFormOptionsItemComponent
  ],
  imports: [
    SharedModule,
    FormsModule,
    ModalModule.forRoot()
  ],
  exports: [
    SheetFormComponent
  ],
  providers: []
})
export class SheetSharedModule { }

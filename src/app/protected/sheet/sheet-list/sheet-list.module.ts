import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { frLocale } from 'ngx-bootstrap/locale';
import { SheetListComponent } from './sheet-list.component';
import { SheetListItemComponent } from './sheet-list-item/sheet-list-item.component';
import { SheetListSearchFormComponent } from './sheet-list-search-form/sheet-list-search-form.component';
import { SheetListSearchFormTextComponent } from './sheet-list-search-form-text/sheet-list-search-form-text.component';
import { SheetListRoutingModule } from './sheet-list-routing.module';
import { SheetListFilterComponent } from './sheet-list-filter/sheet-list-filter.component';
import { SheetListFilterEdfOpenComponent } from './sheet-list-filter-edf-open/sheet-list-filter-edf-open.component';
import { SheetListFilterPartnershipComponent } from './sheet-list-filter-partnership/sheet-list-filter-partnership.component';
import { SheetListFilterSectorComponent } from './sheet-list-filter-sector/sheet-list-filter-sector.component';
import { SheetListFilterDauphinComponent } from './sheet-list-filter-dauphin/sheet-list-filter-dauphin.component';
import { SheetListFilterBeneficiaryComponent } from './sheet-list-filter-beneficiary/sheet-list-filter-beneficiary.component';
import { SheetListFilterAreaComponent } from './sheet-list-filter-area/sheet-list-filter-area.component';
import { SheetListFilterProviderComponent } from './sheet-list-filter-provider/sheet-list-filter-provider.component';
import { SheetListFilterDirectionComponent } from './sheet-list-filter-direction/sheet-list-filter-direction.component';
import { SheetListFilterCategoryComponent } from './sheet-list-filter-category/sheet-list-filter-category.component';
import { SheetListFilterCommitteeComponent } from './sheet-list-filter-committee/sheet-list-filter-committee.component';
import { SheetListFilterStatusComponent } from './sheet-list-filter-status/sheet-list-filter-status.component';
import { SheetListSortComponent } from './sheet-list-sort/sheet-list-sort.component';
import { SheetListExportComponent } from './sheet-list-export/sheet-list-export.component';
import { SheetListShowcaseComponent } from './sheet-list-showcase/sheet-list-showcase.component';
import { SheetListFilterShowcaseComponent } from './sheet-list-filter-showcase/sheet-list-filter-showcase.component';
import { SheetListFilterSubscribeComponent } from './sheet-list-filter-subscribe/sheet-list-filter-subscribe.component';
import { SheetListFilterContratGroupeComponent } from './sheet-list-filter-contrat-groupe/sheet-list-filter-contrat-groupe.component';
import { SheetListFilterMiseAJourDonneeComponent } from './sheet-list-filter-mise-a-jour-donnee/sheet-list-filter-mise-a-jour-donnee.component';
import { SheetListFilterSupplierSizeComponent } from './sheet-list-filter-supplier-size/sheet-list-filter-supplier-size.component';
import { SheetListFilterDateComponent } from './sheet-list-filter-date/sheet-list-filter-date.component';

defineLocale('fr', frLocale);
@NgModule({
  declarations: [
    SheetListComponent,
    SheetListItemComponent,
    SheetListFilterStatusComponent,
    SheetListSearchFormComponent,
    SheetListSearchFormTextComponent,
    SheetListFilterComponent,
    SheetListFilterEdfOpenComponent,
    SheetListFilterPartnershipComponent,
    SheetListFilterSectorComponent,
    SheetListFilterDauphinComponent,
    SheetListFilterBeneficiaryComponent,
    SheetListFilterAreaComponent,
    SheetListFilterProviderComponent,
    SheetListFilterDirectionComponent,
    SheetListFilterCategoryComponent,
    SheetListFilterCommitteeComponent,
    SheetListSortComponent,
    SheetListExportComponent,
    SheetListFilterShowcaseComponent,
    SheetListShowcaseComponent,
    SheetListFilterSubscribeComponent,
    SheetListFilterContratGroupeComponent,
    SheetListFilterMiseAJourDonneeComponent,
    SheetListFilterSupplierSizeComponent,
    SheetListFilterDateComponent
  ],
  imports: [
    SharedModule,
    SheetListRoutingModule
  ]
})
export class SheetListModule { }

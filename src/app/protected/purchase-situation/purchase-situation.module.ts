import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { PurchaseSituationComponent } from './purchase-situation/purchase-situation.component';
import { PurchaseSituationFormComponent } from './purchase-situation-form/purchase-situation-form.component';
import { PurchaseSituationNoResultComponent } from './purchase-situation-no-result/purchase-situation-no-result.component';
import { PurchaseSituationFormWordsComponent } from './purchase-situation-form/purchase-situation-form-words/purchase-situation-form-words.component';
import { PurchaseSituationListItemHeaderComponent } from './purchase-situation-list-item-header/purchase-situation-list-item-header.component';
import { PurchaseSituationListItemBodyComponent } from './purchase-situation-list-item-body/purchase-situation-list-item-body.component';
import { PurchaseSituationListComponent } from './purchase-situation-list/purchase-situation-list.component';
import { PurchaseSituationRoutingModule } from './purchase-situation-routing.module';
import { FilterAllPropertyPipe } from  'src/app/shared/pipes/filter-all-property.pipe';
import { FiltermultiPipe } from  'src/app/shared/pipes/filtermulti.pipe';
@NgModule({
  declarations: [PurchaseSituationComponent, PurchaseSituationListComponent, PurchaseSituationNoResultComponent, PurchaseSituationListItemBodyComponent, PurchaseSituationListItemHeaderComponent, PurchaseSituationFormComponent, PurchaseSituationFormWordsComponent],
  imports: [
    SharedModule,
    PurchaseSituationRoutingModule
  ],
  exports: [],
  providers: [FilterAllPropertyPipe, FiltermultiPipe],
})
export class PurchaseSituationModule { }
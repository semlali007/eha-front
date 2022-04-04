import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { PurchaseComponent } from './purchase/purchase.component';
import { PurchaseFormComponent } from './purchase-form/purchase-form.component';
import { PurchaseNoResultComponent } from './purchase-no-result/purchase-no-result.component';
import { PurchaseFormWordsComponent } from './purchase-form/purchase-form-words/purchase-form-words.component';
import { PurchaseListItemHeaderComponent } from './purchases-list-item-header/purchases-list-item-header.component';
import { PurchaseListItemBodyComponent } from './purchases-list-item-body/purchases-list-item-body.component';
import { PurchaseFilterComponent } from './purchase-filter/purchase-filter.component';
import { PurchaseListComponent } from './purchase-list/purchase-list.component';
import { PurchaseRoutingModule } from './purchase-routing.module';
import { FilterAllPropertyPipe } from  'src/app/shared/pipes/filter-all-property.pipe';
import { FiltermultiPipe } from  'src/app/shared/pipes/filtermulti.pipe';
@NgModule({
  declarations: [PurchaseComponent, PurchaseFormComponent, PurchaseNoResultComponent,PurchaseListItemHeaderComponent, PurchaseListItemBodyComponent, PurchaseListComponent, PurchaseFormWordsComponent,PurchaseFilterComponent],
  imports: [
    SharedModule,
    PurchaseRoutingModule
  ],
  exports: [],
  providers: [FilterAllPropertyPipe, FiltermultiPipe],
})
export class PurchaseModule { }
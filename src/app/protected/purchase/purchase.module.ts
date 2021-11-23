import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { PurchaseComponent } from './purchase/purchase.component';
import { PurchaseFormComponent } from './purchase-form/purchase-form.component';
import { PurchaseResultComponent } from './purchase-result/purchase-result.component';
import { PurchaseFormWordsComponent } from './purchase-form/purchase-form-words/purchase-form-words.component';
import { PurchaseResultItemsComponent } from './purchase-result/purchase-result-items/purchase-result-items.component';
import { PurchaseRoutingModule } from './purchase-routing.module';

@NgModule({
  declarations: [PurchaseComponent, PurchaseFormComponent, PurchaseResultComponent, PurchaseFormWordsComponent, PurchaseResultItemsComponent],
  imports: [
    SharedModule,
    PurchaseRoutingModule
  ],
  exports: []
})
export class PurchaseModule { }

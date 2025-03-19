import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { AnchorComponent } from './anchor/anchor.component';
import { AnchorRoutingModule } from './anchor-routing.module';
import { AnchorFormComponent } from './anchor-form/anchor-form.component';
import { AnchorResultSearchParamsComponent } from './anchor-result-search-params/anchor-result-search-params.component';
import { AnchorResultSearchActiveComponent } from './anchor-result-search-active/anchor-result-search-active.component';
import { AnchorResultSearchNotActiveComponent } from './anchor-result-search-not-active/anchor-result-search-not-active.component';
import { AnchorCodesComponent } from './anchor-codes/anchor-codes.component';
@NgModule({
  declarations: [AnchorComponent, AnchorFormComponent, AnchorResultSearchParamsComponent, AnchorResultSearchActiveComponent, AnchorResultSearchNotActiveComponent, AnchorCodesComponent],
  imports: [
    SharedModule,
    AnchorRoutingModule
  ]
})
export class AnchorModule { }

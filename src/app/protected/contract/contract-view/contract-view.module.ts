import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ContractViewRoutingModule } from './contract-view.routing.module';
import { ContractViewComponent } from './contract-view/contract-view.component';

@NgModule({
  declarations: [ContractViewComponent,
  ],
  imports: [
    SharedModule,
    ContractViewRoutingModule,
  ]
})
export class ContractViewModule { }

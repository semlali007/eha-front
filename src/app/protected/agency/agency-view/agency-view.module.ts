import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { AgencyViewRoutingModule } from './agency-view.routing.module';
import { AgencyViewComponent } from './agency-view/agency-view.component';

@NgModule({
  declarations: [AgencyViewComponent,
  ],
  imports: [
    SharedModule,
    AgencyViewRoutingModule,
  ]
})
export class AgencyViewModule { }

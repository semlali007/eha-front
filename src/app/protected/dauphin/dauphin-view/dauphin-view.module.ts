import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { DauphinViewRoutingModule } from './dauphin-view.routing.module';
import { DauphinViewComponent } from './dauphin-view/dauphin-view.component';

@NgModule({
  declarations: [DauphinViewComponent,
  ],
  imports: [
    SharedModule,
    DauphinViewRoutingModule,
  ]
})
export class DauphinViewModule { }

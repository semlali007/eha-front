import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { GenericItemViewRoutingModule } from './generic-item-view.routing.module';
import { GenericItemViewComponent } from './generic-item-view/generic-item-view.component';

@NgModule({
  declarations: [GenericItemViewComponent,
  ],
  imports: [
    SharedModule,
    GenericItemViewRoutingModule,
  ]
})
export class GenericItemViewModule { }

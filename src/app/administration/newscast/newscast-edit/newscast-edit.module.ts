import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { NcSharedModule } from '../newscast-form/nc-shared.module';
import { NewsCastEditComponent } from './newscast-edit.component';
import { NewsCastEditRoutingModule } from './newscast-edit-routing.module';
@NgModule({
  declarations: [
    NewsCastEditComponent,
  ],
  imports: [
    NcSharedModule,
    NewsCastEditRoutingModule,
    SharedModule
  ]
})
export class NewsCastEditModule { }
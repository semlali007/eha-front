import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { NcSharedModule } from '../newscast-form/nc-shared.module';
import {NewsCastAddComponent } from './newscast-add.component';
import { NewsCastAddRoutingModule } from './newscast-add-routing.module';
@NgModule({
  declarations: [
    NewsCastAddComponent,
  ],
  imports: [
    NcSharedModule,
    NewsCastAddRoutingModule,
    SharedModule
  ]
})
export class NewsCastAddModule { }
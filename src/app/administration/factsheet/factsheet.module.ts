import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { FactsheetRoutingModule } from './factsheet-routing.module';
import { FactsheetComponent } from './factsheet/factsheet.component';
import { FactsheetFormComponent } from './factsheet-form/factsheet-form.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    FactsheetComponent,
    FactsheetFormComponent,
  ],
  imports: [
    FactsheetRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class FactsheetModule { }

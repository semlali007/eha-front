import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { InformationRoutingModule } from './information-routing.module';
import { InformationComponent } from './information/information.component';
import { InformationFormComponent } from './information-form/information-form.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    InformationComponent,
    InformationFormComponent,
  ],
  imports: [
    InformationRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class InformationModule { }

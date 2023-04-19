import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { SatisfactionRoutingModule } from './satisfaction-routing.module';
import { SatisfactionComponent } from './satisfaction/satisfaction.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    SatisfactionComponent,
  ],
  imports: [
    SatisfactionRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class SatisfactionModule { }

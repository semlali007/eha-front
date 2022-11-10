import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { AssociatedRoutingModule } from './associated-routing.module';
import { AssociatedComponent } from './associated/associated.component';
import {AssociatedFormComponent} from './associated-form/associated-form.component';
import {SynonymousFormComponent} from './synonymous-form/synonymous-form.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AssociatedComponent,
    AssociatedFormComponent,
    SynonymousFormComponent
  ],
  imports: [
    AssociatedRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class AssociatedModule { }

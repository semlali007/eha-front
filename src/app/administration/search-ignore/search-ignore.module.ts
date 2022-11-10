import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { SearchIgnoreRoutingModule } from './search-ignore-routing.module';
import { SearchIgnoreComponent } from './search-ignore/search-ignore.component';
import { IgnoreFormComponent } from './ignore-form/ignore-form.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    SearchIgnoreComponent,
    IgnoreFormComponent
  ],
  imports: [
    SearchIgnoreRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class SearchIgnoreModule { }

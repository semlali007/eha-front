import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { PageRoutingModule } from './page-routing.module';
import { PageComponent } from './page/page.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    PageComponent,
  ],
  imports: [
    PageRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class PageModule { }

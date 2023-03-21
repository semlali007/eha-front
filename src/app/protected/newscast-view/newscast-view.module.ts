import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { frLocale } from 'ngx-bootstrap/locale';
import { NewsCastViewComponent } from './newscast-view.component';
import { NewsCastViewRoutingModule } from'./newscast-view-routing.module';
defineLocale('fr', frLocale);
@NgModule({
  declarations: [
    NewsCastViewComponent,
  ],
  imports: [
    SharedModule,
    NewsCastViewRoutingModule
  ]
})
export class NewsCastViewModule { }

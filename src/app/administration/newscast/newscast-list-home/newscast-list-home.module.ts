import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { frLocale } from 'ngx-bootstrap/locale';
import { NewsCastListHomeComponent } from './newscast-list-home.component';
import { NewsCastListHomeRoutingModule } from './newscast-list-home-routing.module';

defineLocale('fr', frLocale);
@NgModule({
  declarations: [
    NewsCastListHomeComponent,
  ],
  imports: [
    SharedModule,
    NewsCastListHomeRoutingModule
  ]
})
export class NewsCastListHomeModule { }

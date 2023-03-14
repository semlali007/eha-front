import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { frLocale } from 'ngx-bootstrap/locale';
import { NewsCastListHomeComponent } from './newscast-list-home.component';
import { NewsCastListHomeItemComponent } from './newscast-list-home-item/newscast-list-home-item.component';
import { NewsCastListHomeRoutingModule } from './newscast-list-home-routing.module';

defineLocale('fr', frLocale);
@NgModule({
  declarations: [
    NewsCastListHomeComponent,
    NewsCastListHomeItemComponent
  ],
  imports: [
    SharedModule,
    NewsCastListHomeRoutingModule
  ]
})
export class NewsCastListHomeModule { }

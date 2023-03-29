import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { frLocale } from 'ngx-bootstrap/locale';
import { NewsCastListComponent } from './newscast-list.component';
import { NewsCastListItemComponent } from './newscast-list-item/newscast-list-item.component';
import { NewsCastListRoutingModule } from './newscast-list-routing.module';

defineLocale('fr', frLocale);
@NgModule({
  declarations: [
    NewsCastListComponent,
    NewsCastListItemComponent
  ],
  imports: [
    SharedModule,
    NewsCastListRoutingModule
  ]
})
export class NewsCastListModule { }

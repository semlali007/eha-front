import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { frLocale } from 'ngx-bootstrap/locale';
import { SheetViewComponent } from './sheet-view.component';
import { SheetViewRoutingModule } from'./sheet-view-routing.module';
defineLocale('fr', frLocale);
@NgModule({
  declarations: [
    SheetViewComponent,
  ],
  imports: [
    SharedModule,
    SheetViewRoutingModule
  ]
})
export class SheetViewModule { }

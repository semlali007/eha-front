import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { SheetSharedModule } from '../sheet-form/sheet-shared.module';
import { SheetAddComponent } from './sheet-add.component';
import { SheetAddRoutingModule } from './sheet-add-routing.module';
@NgModule({
  declarations: [
    SheetAddComponent,
  ],
  imports: [
    SheetSharedModule,
    SheetAddRoutingModule,
    SharedModule
  ]
})
export class SheetAddModule { }
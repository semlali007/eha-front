import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { SheetSharedModule } from '../sheet-form/sheet-shared.module';
import { SheetEditComponent } from './sheet-edit.component';
import { SheetEditRoutingModule } from './sheet-edit-routing.module';
@NgModule({
  declarations: [
    SheetEditComponent,
  ],
  imports: [
    SheetSharedModule,
    SheetEditRoutingModule,
    SharedModule
  ]
})
export class SheetEditModule { }
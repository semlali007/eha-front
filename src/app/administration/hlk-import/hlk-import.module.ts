import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { HlkImportComponent } from './hlk-import/hlk-import.component';
import { HlkImportRoutingModule } from './hlk-import-routing.module';

@NgModule({
  declarations: [
    HlkImportComponent
  ],
  imports: [
    SharedModule,
    FormsModule,
    HlkImportRoutingModule
  ]
})
export class HlkImportModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FactsheetComponent } from './factsheet/factsheet.component';

const routes: Routes = [ { path: '', component: FactsheetComponent } ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FactsheetRoutingModule { }

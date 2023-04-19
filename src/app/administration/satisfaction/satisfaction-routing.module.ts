import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SatisfactionComponent } from './satisfaction/satisfaction.component';

const routes: Routes = [ { path: '', component: SatisfactionComponent } ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SatisfactionRoutingModule { }

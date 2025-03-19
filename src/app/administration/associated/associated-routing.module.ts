import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssociatedComponent } from './associated/associated.component';

const routes: Routes = [ { path: '', component: AssociatedComponent } ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssociatedRoutingModule { }

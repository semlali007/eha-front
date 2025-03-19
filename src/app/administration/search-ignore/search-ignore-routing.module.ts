import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchIgnoreComponent } from './search-ignore/search-ignore.component';

const routes: Routes = [ { path: '', component: SearchIgnoreComponent } ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchIgnoreRoutingModule { }

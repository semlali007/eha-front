import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchWordsComponent } from './search-words/search-words.component';

const routes: Routes = [ { path: '', component: SearchWordsComponent } ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchWordsRoutingModule { }

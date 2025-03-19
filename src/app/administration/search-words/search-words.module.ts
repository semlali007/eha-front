import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { SearchWordsRoutingModule } from './search-words-routing.module';
import { SearchWordsComponent } from './search-words/search-words.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    SearchWordsComponent,
  ],
  imports: [
    SearchWordsRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class SearchWordsModule { }

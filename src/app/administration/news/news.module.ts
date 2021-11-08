import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { NewsRoutingModule } from './news-routing.module';
import { NewsComponent } from './news/news.component';
import { NewsAddComponent } from './news-add/news-add.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    NewsComponent,
    NewsAddComponent,
  ],
  imports: [
    NewsRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class NewsModule { }

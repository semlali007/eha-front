import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { NewsRoutingModule } from './news-routing.module';
import { NewsComponent } from './news/news.component';
import { NewsFormComponent } from './news-form/news-form.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    NewsComponent,
    NewsFormComponent,
  ],
  imports: [
    NewsRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class NewsModule { }

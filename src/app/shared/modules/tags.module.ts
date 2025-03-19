import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagInputModule } from 'ngx-chips';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TagInputModule
  ],
  exports: [
    TagInputModule
  ]

})
export class TagsModule { }

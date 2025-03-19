import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { HotelineAddRoutingModule } from './hotline-add.routing.module';
import { HotlineAddComponent } from './hotline-add/hotline-add.component';
import { HotlineFormComponent } from './hotline-form/hotline-form.component';
import { HotlineFormThemeComponent } from './hotline-form/hotline-form-theme/hotline-form-theme.component';
import { HotlineFormCategoryComponent } from './hotline-form/hotline-form-category/hotline-form-category.component';
import { HotlineFormQuestionComponent } from './hotline-form/hotline-form-question/hotline-form-question.component';
import { HotlineFormEntityComponent } from './hotline-form/hotline-form-entity/hotline-form-entity.component';


@NgModule({
  declarations: [HotlineAddComponent, 
    HotlineFormComponent, 
    HotlineFormThemeComponent, 
    HotlineFormCategoryComponent, 
    HotlineFormQuestionComponent, 
    HotlineFormEntityComponent,
    
  ],
  imports: [
    SharedModule,
    HotelineAddRoutingModule,
  ]
})
export class HotlineAddModule { }

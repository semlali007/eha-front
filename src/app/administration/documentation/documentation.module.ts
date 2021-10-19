import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { DocumentationComponent } from './documentation/documentation.component';
import { DocumentationFormComponent } from './documentation-form/documentation-form.component';
import { DocumentationRoutingModule } from './documentation-routing.module'



@NgModule({
  declarations: [DocumentationComponent, DocumentationFormComponent],
  imports: [
    SharedModule,
    DocumentationRoutingModule
  ]
})
export class DocumentationModule { }


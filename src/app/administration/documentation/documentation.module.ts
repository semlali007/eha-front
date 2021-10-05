import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { DocumentationComponent } from './documentation/documentation.component';
import { DocumentationAddComponent } from './documentation-add/documentation-add.component';
import { DocumentationRoutingModule } from './documentation-routing.module'



@NgModule({
  declarations: [DocumentationComponent, DocumentationAddComponent],
  imports: [
    SharedModule,
    DocumentationRoutingModule
  ]
})
export class DocumentationModule { }

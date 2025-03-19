import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { DocumentationComponent } from './documentation.component';
import { DocumentationRoutingModule } from './documentation-routing.module';

@NgModule({
  declarations: [DocumentationComponent],
  imports: [
    SharedModule,
    DocumentationRoutingModule
  ]
})
export class DocumentationModule { }

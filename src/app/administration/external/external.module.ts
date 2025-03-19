import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ExternalRoutingModule } from './external-routing.module';
import { ExternalComponent } from './external/external.component';

@NgModule({
  declarations: [ExternalComponent],
  imports: [
    SharedModule,
    ExternalRoutingModule
  ]
})
export class ExternalModule { }

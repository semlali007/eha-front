import { NgModule } from '@angular/core';
import {SharedModule} from '../../shared/shared.module';
import { SatisfactionComponent } from './satisfaction/satisfaction.component';
import { SatisfactionRoutingModule } from './satisfaction-routing.module';

@NgModule({
  declarations: [SatisfactionComponent],
  imports: [
    SharedModule,
    SatisfactionRoutingModule 
  ]
})
export class SatisfactionModule { }

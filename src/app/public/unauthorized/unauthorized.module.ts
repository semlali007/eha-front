import { NgModule } from '@angular/core';
import {SharedModule} from '../../shared/shared.module';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { UnauthorizedRoutingModule } from './unauthorized-routing.module';

@NgModule({
  declarations: [UnauthorizedComponent],
  imports: [
    SharedModule,
    UnauthorizedRoutingModule
  ]
})
export class UnauthorizedModule { }

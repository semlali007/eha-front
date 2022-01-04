import { NgModule } from '@angular/core';
import {SharedModule} from '../../shared/shared.module';
import { LogoutComponent } from './logout/logout.component';
import { LogoutRoutingModule } from './logout-routing.module';

@NgModule({
  declarations: [LogoutComponent],
  imports: [
    SharedModule,
    LogoutRoutingModule 
  ]
})
export class LogoutModule { }

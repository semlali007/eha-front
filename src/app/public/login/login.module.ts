import { NgModule } from '@angular/core';
import {SharedModule} from '../../shared/shared.module';
import { LoginComponent } from './login/login.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { LoginRoutingModule } from './login-routing.module';

@NgModule({
  declarations: [LoginComponent, LoginFormComponent],
  imports: [
    SharedModule,
    LoginRoutingModule 
  ]
})
export class LoginModule { }

import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { AdministratorComponent } from './administrator/administrator.component';
import { AdministratorRoutingModule } from './administrator-routing.module'



@NgModule({
  declarations: [AdministratorComponent],
  imports: [
    SharedModule,
    AdministratorRoutingModule
  ]
})
export class AdministratorModule { }

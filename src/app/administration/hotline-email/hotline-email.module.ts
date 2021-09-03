import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { HotlineEmailComponent } from './hotline-email/hotline-email.component';
import { HotlineEmailRoutingModule } from './hotline-email-routing.module'
import { HotlineEmailEditComponent } from './hotline-email-edit/hotline-email-edit.component'


@NgModule({
  declarations: [HotlineEmailComponent, HotlineEmailEditComponent],
  imports: [
    SharedModule,
    HotlineEmailRoutingModule
  ]
})
export class HotlineEmailModule { }

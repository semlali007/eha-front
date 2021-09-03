import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { HotlineGroupComponent } from './hotline-group/hotline-group.component';
import { HotlineGroupRoutingModule } from './hotline-group-routing.module'



@NgModule({
  declarations: [HotlineGroupComponent],
  imports: [
    SharedModule,
    HotlineGroupRoutingModule
  ]
})
export class HotlineGroupModule { }

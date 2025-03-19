import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { NewsCastComponent } from './newscast.component';
import { NewsCastRoutingModule } from './newscast-routing.module';

@NgModule({
  declarations: [NewsCastComponent,],
  imports: [
    SharedModule,
    NewsCastRoutingModule
  ]
})
export class NewsCastModule { }

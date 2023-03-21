import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { NewsCastComponent } from './NewsCast.component';
import { NewsCastRoutingModule } from './NewsCast-routing.module';

@NgModule({
  declarations: [NewsCastComponent,],
  imports: [
    SharedModule,
    NewsCastRoutingModule
  ]
})
export class NewsCastModule { }

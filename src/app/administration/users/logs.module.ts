import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { LogsRoutingModule } from './logs-routing.module';
import { LogsComponent } from './logs/logs.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    LogsComponent,
  ],
  imports: [
    LogsRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class LogsModule { }

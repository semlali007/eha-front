import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { VersionComponent } from './version.component';
import { VersionRoutingModule } from './version-routing.module'

@NgModule({
  declarations: [VersionComponent],
  imports: [
    SharedModule,
    VersionRoutingModule
  ]
})
export class VersionModule { }

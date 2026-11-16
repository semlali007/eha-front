import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { HlkSyncComponent } from './hlk-sync/hlk-sync.component';
import { HlkSyncRoutingModule } from './hlk-sync-routing.module';

@NgModule({
  declarations: [
    HlkSyncComponent
  ],
  imports: [
    SharedModule,
    HlkSyncRoutingModule
  ]
})
export class HlkSyncModule { }

import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { MediaComponent } from './media.component';
import { MediaRoutingModule } from './media-routing.module';

@NgModule({
  declarations: [MediaComponent],
  imports: [
    SharedModule,
    MediaRoutingModule
  ]
})
export class MediaModule { }

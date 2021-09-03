import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { HotlineThemeComponent } from './hotline-theme/hotline-theme.component';
import { HotlineThemeRoutingModule } from './hotline-theme-routing.module'



@NgModule({
  declarations: [HotlineThemeComponent],
  imports: [
    SharedModule,
    HotlineThemeRoutingModule
  ]
})
export class HotlineThemeModule { }

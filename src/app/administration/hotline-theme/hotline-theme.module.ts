import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { HotlineThemeComponent } from './hotline-theme/hotline-theme.component';
import { HotlineThemeFormComponent } from './hotline-theme-form/hotline-theme-form.component';
import { HotlineThemeRoutingModule } from './hotline-theme-routing.module'



@NgModule({
  declarations: [HotlineThemeComponent, HotlineThemeFormComponent],
  imports: [
    SharedModule,
    HotlineThemeRoutingModule
  ]
})
export class HotlineThemeModule { }

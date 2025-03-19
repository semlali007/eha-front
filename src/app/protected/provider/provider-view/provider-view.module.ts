import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProviderViewRoutingModule } from './provider-view.routing.module';
import { ProviderViewComponent } from './provider-view/provider-view.component';

@NgModule({
  declarations: [ProviderViewComponent,
  ],
  imports: [
    SharedModule,
    ProviderViewRoutingModule,
  ]
})
export class ProviderViewModule { }

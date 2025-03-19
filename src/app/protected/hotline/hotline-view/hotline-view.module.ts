import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { HotlineViewRoutingModule } from './hotline-view.routing.module';
import { HotlineViewComponent } from './hotline-view/hotline-view.component';
import { HotlineViewItemsComponent } from './hotline-view-items/hotline-view-items.component';
import { HotlineModalMessageComponent } from './hotline-modal-message/hotline-modal-message.component';
import { HotlineModalFileComponent } from './hotline-modal-file/hotline-modal-file.component';
import { HotlineModalForwardComponent } from './hotline-modal-forward/hotline-modal-forward.component';
import { HotlineModalCloseComponent } from './hotline-modal-close/hotline-modal-close.component';

@NgModule({
  declarations: [HotlineViewComponent, 
    HotlineViewItemsComponent, 
    HotlineModalMessageComponent, 
    HotlineModalFileComponent, 
    HotlineModalForwardComponent, 
    HotlineModalCloseComponent,
    
  ],
  imports: [
    SharedModule,
    HotlineViewRoutingModule,
  ]
})
export class HotlineViewModule { }

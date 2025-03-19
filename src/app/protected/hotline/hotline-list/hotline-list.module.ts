import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { HotlineListComponent } from './hotline-list/hotline-list.component';
import { HotlineChangeInformationsComponent } from './hotline-change-informations/hotline-change-informations.component';
import { HotlineListFilterFormComponent } from './hotline-list-filter-form/hotline-list-filter-form.component';
import { HotlineListItemsComponent } from './hotline-list-items/hotline-list-items.component';
import { HotlineListRoutingModule } from './hotline-list.routing.module';
import { HotlineListEmailComponent } from './hotline-list-email/hotline-list-email.component';

@NgModule({
  declarations: [
    HotlineListComponent,
    HotlineChangeInformationsComponent,
    HotlineListFilterFormComponent,
    HotlineListItemsComponent,
    HotlineListEmailComponent
  ],
  imports: [
    SharedModule,
    HotlineListRoutingModule
  ]
})
export class HotlineListModule { }

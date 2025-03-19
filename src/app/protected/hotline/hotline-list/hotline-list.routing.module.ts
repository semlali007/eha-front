import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HotlineListComponent } from './hotline-list/hotline-list.component';

const routes: Routes = [
    { path: '', component: HotlineListComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HotlineListRoutingModule { }

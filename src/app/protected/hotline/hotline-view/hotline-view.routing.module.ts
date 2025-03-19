import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HotlineViewComponent } from './hotline-view/hotline-view.component';

const routes: Routes = [
    { path: '', component: HotlineViewComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HotlineViewRoutingModule { }

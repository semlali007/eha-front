import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DauphinViewComponent } from './dauphin-view/dauphin-view.component';

const routes: Routes = [
    { path: '', component: DauphinViewComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DauphinViewRoutingModule { }

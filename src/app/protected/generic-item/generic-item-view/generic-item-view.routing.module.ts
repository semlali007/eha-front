import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GenericItemViewComponent } from './generic-item-view/generic-item-view.component';

const routes: Routes = [
    { path: '', component: GenericItemViewComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GenericItemViewRoutingModule { }

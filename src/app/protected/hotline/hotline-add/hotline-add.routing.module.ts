import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HotlineAddComponent } from './hotline-add/hotline-add.component';

const routes: Routes = [
    { path: '', component: HotlineAddComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HotelineAddRoutingModule { }

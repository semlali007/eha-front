import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewsCastViewComponent } from './newscast-view.component';

const routes: Routes = [
    { path: '', component: NewsCastViewComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class NewsCastViewRoutingModule { }

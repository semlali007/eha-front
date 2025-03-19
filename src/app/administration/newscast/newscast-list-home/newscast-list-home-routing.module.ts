import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewsCastListHomeComponent } from './newscast-list-home.component';

const routes: Routes = [
    { path: '', component: NewsCastListHomeComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class NewsCastListHomeRoutingModule { }

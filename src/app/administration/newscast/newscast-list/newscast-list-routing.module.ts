import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewsCastListComponent } from './newscast-list.component';

const routes: Routes = [
    { path: '', component: NewsCastListComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class NewsCastListRoutingModule { }

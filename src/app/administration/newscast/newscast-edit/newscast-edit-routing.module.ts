import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewsCastEditComponent } from './newscast-edit.component';

const routes: Routes = [
    { path: '', component: NewsCastEditComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class NewsCastEditRoutingModule { }

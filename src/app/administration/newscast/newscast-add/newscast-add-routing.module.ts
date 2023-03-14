import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewsCastAddComponent } from './newscast-add.component';

const routes: Routes = [
    { path: '', component: NewsCastAddComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class NewsCastAddRoutingModule { }

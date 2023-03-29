import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewsCastComponent } from './newscast.component';

const routes: Routes = [
    { path: '', component: NewsCastComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class NewsCastRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AgencyViewComponent } from './agency-view/agency-view.component';

const routes: Routes = [
    { path: '', component: AgencyViewComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AgencyViewRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContractViewComponent } from './contract-view/contract-view.component';

const routes: Routes = [
    { path: '', component: ContractViewComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ContractViewRoutingModule { }

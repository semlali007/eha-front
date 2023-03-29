import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PurchaseSituationComponent } from './purchase-situation/purchase-situation.component';
const routes: Routes = [
    { path: '', component: PurchaseSituationComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PurchaseSituationRoutingModule { }

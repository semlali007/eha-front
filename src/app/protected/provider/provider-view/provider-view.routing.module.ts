import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProviderViewComponent } from './provider-view/provider-view.component';

const routes: Routes = [
    { path: '', component: ProviderViewComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProviderViewRoutingModule { }

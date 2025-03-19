import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExternalComponent } from './external/external.component';

const routes: Routes = [
	{ path: '', component: ExternalComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ExternalRoutingModule { }

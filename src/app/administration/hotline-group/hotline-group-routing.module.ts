import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HotlineGroupComponent } from './hotline-group/hotline-group.component';

const routes: Routes = [
	{ path: '', component: HotlineGroupComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class HotlineGroupRoutingModule { }

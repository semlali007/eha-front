import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HlkSyncComponent } from './hlk-sync/hlk-sync.component';

const routes: Routes = [
	{ path: '', component: HlkSyncComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class HlkSyncRoutingModule { }

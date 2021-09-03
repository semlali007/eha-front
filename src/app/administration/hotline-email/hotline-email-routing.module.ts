import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HotlineEmailComponent } from './hotline-email/hotline-email.component';

const routes: Routes = [
	{ path: '', component: HotlineEmailComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class HotlineEmailRoutingModule { }

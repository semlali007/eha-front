import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HotlineThemeComponent } from './hotline-theme/hotline-theme.component';

const routes: Routes = [
	{ path: '', component: HotlineThemeComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class HotlineThemeRoutingModule { }

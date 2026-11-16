import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HlkImportComponent } from './hlk-import/hlk-import.component';

const routes: Routes = [
	{ path: '', component: HlkImportComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class HlkImportRoutingModule { }

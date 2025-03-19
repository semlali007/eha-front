import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SheetViewComponent } from './sheet-view.component';

const routes: Routes = [
    { path: '', component: SheetViewComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SheetViewRoutingModule { }

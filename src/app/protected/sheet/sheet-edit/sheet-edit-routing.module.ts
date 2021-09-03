import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SheetEditComponent } from './sheet-edit.component';

const routes: Routes = [
    { path: '', component: SheetEditComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SheetEditRoutingModule { }

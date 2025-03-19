import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SheetAddComponent } from './sheet-add.component';

const routes: Routes = [
    { path: '', component: SheetAddComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SheetAddRoutingModule { }

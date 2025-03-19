import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { HomeResolver } from './home/home.resolver';
const routes: Routes = [
  { 
  path: '',
   resolve: {
    check: HomeResolver
  }, 
  component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [HomeResolver]
})
export class HomeRoutingModule { }

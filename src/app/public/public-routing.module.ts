import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
   path: 'login',
   loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'version.html',
    loadChildren: () => import('./version/version.module').then(m => m.VersionModule)
   },
   {
    path: 'logout',
    loadChildren: () => import('./logout/logout.module').then(m => m.LogoutModule)
   },
   {
    path: 'unauthorized',
    loadChildren: () => import('./unauthorized/unauthorized.module').then(m => m.UnauthorizedModule)
   },
 ];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }

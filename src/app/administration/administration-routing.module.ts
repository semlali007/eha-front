import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdministrationComponent } from './administration.component';
import {  EhaAdminRoleGuard } from 'src/app/core/guards/eha-admin-role.guard';
const routes: Routes = [
  {
    path: 'admin',
    component: AdministrationComponent,
    canActivate: [EhaAdminRoleGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
      },
      {
        path: 'administrator',
        loadChildren: () => import('./administrator/administrator.module').then(m => m.AdministratorModule),
      },
      {
        path: 'external',
        loadChildren: () => import('./external/external.module').then(m => m.ExternalModule),
      },
      {
        path: 'hotline-theme',
        loadChildren: () => import('./hotline-theme/hotline-theme.module').then(m => m.HotlineThemeModule),
      },
      {
        path: 'hotline-group',
        loadChildren: () => import('./hotline-group/hotline-group.module').then(m => m.HotlineGroupModule),
      },
      {
        path: 'hotline-email',
        loadChildren: () => import('./hotline-email/hotline-email.module').then(m => m.HotlineEmailModule),
      },
      {
        path: 'documentation',
        loadChildren: () => import('./documentation/documentation.module').then(m => m.DocumentationModule),
      },
      {
        path: 'migration/:type',
        loadChildren: () => import('./migration/migration.module').then(m => m.MigrationModule),
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrationRoutingModule { }

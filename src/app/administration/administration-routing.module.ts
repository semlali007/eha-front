import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdministrationComponent } from './administration.component';
import {  EhaAdminRoleGuard } from 'src/app/core/guards/eha-admin-role.guard';
import { AuthGuardWithForcedLogin } from 'src/app/core/guards/auth-guard-with-forced-login.service';
import { AuthGuard } from 'src/app/core/guards/auth-guard.service';

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
        path: 'documentation/:id',
        loadChildren: () => import('./documentation/documentation.module').then(m => m.DocumentationModule),
      },
      {
        path: 'migration/:type',
        loadChildren: () => import('./migration/migration.module').then(m => m.MigrationModule),
      },
      {
        path: 'news/:type',
        loadChildren: () => import('./news/news.module').then(m => m.NewsModule),
      },
      {
        path: 'page/:page',
        loadChildren: () => import('./page/page.module').then(m => m.PageModule),
      },
      {
        path: 'information/:type',
        loadChildren: () => import('./information/information.module').then(m => m.InformationModule),
      },
      {
        path: 'fiche-pratique/list',
        loadChildren: () => import('./factsheet/factsheet.module').then(m => m.FactsheetModule),
      },
      {
        path: 'recherche/logs',
        loadChildren: () => import('./logs/logs.module').then(m => m.LogsModule),
      },
      {
        path: 'recherche/mots-ignorer',
        loadChildren: () => import('./search-ignore/search-ignore.module').then(m => m.SearchIgnoreModule),
      },
      {
        path: 'recherche/mots-associer',
        loadChildren: () => import('./associated/associated.module').then(m => m.AssociatedModule),
      },
      {
        path: 'recherche/mots-rechercher',
        loadChildren: () => import('./search-words/search-words.module').then(m => m.SearchWordsModule),
      },
      {
        path: 'actualites',
        loadChildren: () => import('./newscast/newscast-list/newscast-list.module').then(m => m.NewsCastListModule),
      },
      {
        path: 'actualites/creation',
        loadChildren: () => import('./newscast/newscast-add/newscast-add.module').then(m => m.NewsCastAddModule),
      },
      {
        path: 'actualites/accueil',
        loadChildren: () => import('./newscast/newscast-list-home/newscast-list-home.module').then(m => m.NewsCastListHomeModule),
      },
      {
        path: 'actualites/detail/:id',
        loadChildren: () => import('./newscast/newscast-view/newscast-view.module').then(m => m.NewsCastViewModule),
      },
      {
        path: 'actualites/modification/:id',
        loadChildren: () => import('./newscast/newscast-edit/newscast-edit.module').then(m => m.NewsCastEditModule),
      },
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrationRoutingModule { }

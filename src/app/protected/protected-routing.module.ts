import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/guards/auth-guard.service';
import { EhaAdminRoleGuard } from 'src/app/core/guards/eha-admin-role.guard';
import { AuthGuardWithForcedLogin } from 'src/app/core/guards/auth-guard-with-forced-login.service';
import {EhaGestionnaireRoleGuard} from 'src/app/core/guards/eha-gestionnaire-role.guard' ;

const routes: Routes = [
  {
    path: 'app',
    children: [
      {
        path: 'accueil',
        loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
      },
      {
        path: 'fiches/creation',
        loadChildren: () => import('./sheet/sheet-add/sheet-add.module').then(m => m.SheetAddModule),
        canActivate: [EhaGestionnaireRoleGuard],
        data: {
          breadcrumb: [
            { route: "/app/accueil", label: "Accueil" },
            { route: "/app/fiches/liste", label: "Vitrine de l’Offre" },
            { route: null, label: "Ajouter une fiche" }
          ]
        },
      },
      {
        path: 'fiches/liste',
        loadChildren: () => import('./sheet/sheet-list/sheet-list.module').then(m => m.SheetListModule),
        data: {
          breadcrumb: [
            { route: "/app/accueil", label: "Accueil" },
            { route: null, label: "Vitrine de l’Offre" }
          ]
        },
      },
      {
        path: 'fiches/modification/:id',
        loadChildren: () => import('./sheet/sheet-edit/sheet-edit.module').then(m => m.SheetEditModule),
        canActivate: [EhaGestionnaireRoleGuard] ,
        data: {
          breadcrumb: [
            { route: "/app/accueil", label: "Accueil" },
            { route: "/app/fiches/liste", label: "Vitrine de l’Offre" },
            { route: null, label: "Modifier une fiche" }
          ]
        },
      },
      {
        path: 'fiches/details/:id',
        loadChildren: () => import('./sheet/sheet-view/sheet-view.module').then(m => m.SheetViewModule),
        data: {
          breadcrumb: [
            { route: "/app/accueil", label: "Accueil" },
            { route: "/app/fiches/liste", label: "Vitrine de l’Offre" },
            { route: null, label: "Détails d'une fiche" }
          ]
        },
      },
      {
        path: 'recherche',
        loadChildren: () => import('./search/search.module').then(m => m.SearchModule),
        data: {
          breadcrumb: [
            { route: "/app/accueil", label: "Accueil" },
            { route: null, label: "Rechercher" },
          ]
        },
      },
      {
        path: 'ancrage/:code',
        loadChildren: () => import('./anchor/anchor.module').then(m => m.AnchorModule),
        data: {
          breadcrumb: [
            { route: "/app/accueil", label: "Accueil" },
            { route: null, label: "Ancrage" },
          ]
        },
      },
      {
        path: 'hotline/create',
        loadChildren: () => import('./hotline/hotline-add/hotline-add.module').then(m => m.HotlineAddModule),
        data: {
          breadcrumb: [
            { route: "/app/accueil", label: "Accueil" },
            { route: "/app/hotline/list", label: "Mes demandes" },
            { route: null, label: "Poser une question" }
          ]
        },
      },
      {
        path: 'hotline/list',
        loadChildren: () => import('./hotline/hotline-list/hotline-list.module').then(m => m.HotlineListModule),
        data: {
          breadcrumb: [
            { route: "/app/accueil", label: "Accueil" },
            { route: null, label: "Mes demandes" }
          ]
        },
      },
      {
        path: 'hotline/get/:id/:sha',
        loadChildren: () => import('./hotline/hotline-view/hotline-view.module').then(m => m.HotlineViewModule),
        data: {
          breadcrumb: [
            { route: "/app/accueil", label: "Accueil" },
            { route: "/app/hotline/list", label: "Mes demandes" },
            { route: null, label: "Détails d'une question" }
          ]
        },
      },
      {
        path: 'contrat/details/:code',
        loadChildren: () => import('./contract/contract-view/contract-view.module').then(m => m.ContractViewModule),
        data: {
          breadcrumb: [
            { route: "/app/accueil", label: "Accueil" },
            { route: "/app/recherche", label: "Rechercher" },
            { route: null, label: "Contrat" }
          ]
        },
      },
      {
        path: 'fournisseur/details/:code',
        loadChildren: () => import('./provider/provider-view/provider-view.module').then(m => m.ProviderViewModule),
        data: {
          breadcrumb: [
            { route: "/app/accueil", label: "Accueil" },
            { route: "/app/recherche", label: "Rechercher" },
            { route: null, label: "Fournisseur" }
          ]
        },
      },
       {
        path: 'dauphin/details/:code',
        loadChildren: () => import('./dauphin/dauphin-view/dauphin-view.module').then(m => m.DauphinViewModule),
        data: {
          breadcrumb: [
            { route: "/app/accueil", label: "Accueil" },
            { route: "/app/recherche", label: "Rechercher" },
            { route: null, label: "Dauphin" }
          ]
        },
      },
      {
        path: 'article/details/:code',
        loadChildren: () => import('./generic-item/generic-item-view/generic-item-view.module').then(m => m.GenericItemViewModule),
        data: {
          breadcrumb: [
            { route: "/app/accueil", label: "Accueil" },
            { route: "/app/recherche", label: "Rechercher" },
            { route: null, label: "Article" }
          ]
        },
      
      },
      {
        path: 'documentation/:id', loadChildren: () => import('./documentation/documentation.module').then(m => m.DocumentationModule),
      },
      {
        path: 'ma-situation-achat',
        loadChildren: () => import('./purchase/purchase.module').then(m => m.PurchaseModule),
        data: {
          breadcrumb: [
            { route: "/app/accueil", label: "Accueil" },
            { route: null, label: "Ma situation achat" },
          ]
        },
      },
    ],
   canActivate: [AuthGuardWithForcedLogin],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProtectedRoutingModule { }

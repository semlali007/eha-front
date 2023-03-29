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
        data:{
          title:'accueil'
        }
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
          ],
          title:'Ajouter une fiche'
        },
      },
      {
        path: 'fiches/liste',
        loadChildren: () => import('./sheet/sheet-list/sheet-list.module').then(m => m.SheetListModule),
        data: {
          breadcrumb: [
            { route: "/app/accueil", label: "Accueil" },
            { route: null, label: "Vitrine de l’Offre" }
          ],
          title:'Vitrine de l’Offre'
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
          ],
          title:'Modifier une fiche'
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
          ],
           title:"Détails d'une fiche"
        },
      },
      {
        path: 'recherche',
        loadChildren: () => import('./search/search.module').then(m => m.SearchModule),
        data: {
          breadcrumb: [
            { route: "/app/accueil", label: "Accueil" },
            { route: null, label: "Rechercher" },
          ],
          title:"Rechercher"
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
          ],
          title:"Poser une question"
        },
      },
      {
        path: 'hotline/list',
        loadChildren: () => import('./hotline/hotline-list/hotline-list.module').then(m => m.HotlineListModule),
        data: {
          breadcrumb: [
            { route: "/app/accueil", label: "Accueil" },
            { route: null, label: "Mes demandes" }
          ],
          title:"Mes demandes"
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
          ],
          title:"Détails d'une question"
        },
      },
      {
        path: 'hotline/get/:id',
        loadChildren: () => import('./hotline/hotline-view/hotline-view.module').then(m => m.HotlineViewModule),
        data: {
          breadcrumb: [
            { route: "/app/accueil", label: "Accueil" },
            { route: "/app/hotline/list", label: "Mes demandes" },
            { route: null, label: "Détails d'une question" }
          ],
          title:"Détails d'une question"
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
          ],
          title:"Contrat"
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
          ],
          title:"Fournisseur"
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
          ],
          title:"Produit"
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
          ],
          title:"Article"
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
          ],
          title:"Ma situation achat"
        },
      },
      {
        path: 'media/view/:id', loadChildren: () => import('./media/media.module').then(m => m.MediaModule),
      },
      {
        path: 'actualites/detail/:id', loadChildren: () => import('./newscast-view/newscast-view.module').then(m => m.NewsCastViewModule),
        data: {
          breadcrumb: [
            { route: "/app/accueil", label: "Accueil" },
            { route: "/app/actualites", label: "Actualité" },
            { route: null, label: "Article" }
          ],
          title:"Actualité"
        },
      },
      {
        path: 'actualites', loadChildren: () => import('./newscast/newscast.module').then(m => m.NewsCastModule),
        data: {
          breadcrumb: [
            { route: "/app/accueil", label: "Accueil" },
            { route: null, label: "Actualité" },
          ],
          title:"Actualité"
        },
      },
      {
        path: 'mes-demandes-achat',
        loadChildren: () => import('./purchase-situation/purchase-situation.module').then(m => m.PurchaseSituationModule),
        data: {
          breadcrumb: [
            { route: "/app/accueil", label: "Accueil" },
            { route: null, label: "Ma situation achat" },
          ],
          title:"Ma situation achat"
        },
      },
    ],
   canActivate: [AuthGuard],
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProtectedRoutingModule { }

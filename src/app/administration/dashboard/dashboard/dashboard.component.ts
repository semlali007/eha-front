import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit {
  public readonly sections = [
    {
      icon: 'search',
      color: 'sky',
      title: 'Fonction de recherche',
      description: 'Historique, mots à ignorer, mots à associer et récurrence des recherches.',
      count: '4 outils',
      path: '/admin/recherche/logs',
    },
    {
      icon: 'phone',
      color: 'teal',
      title: 'Hotlines',
      description: 'Thèmes, groupes et e-mails destinataires des hotlines.',
      count: '3 outils',
      path: '/admin/hotline-theme',
    },
    {
      icon: 'book',
      color: 'violet',
      title: 'Documentation',
      description: 'Arborescence de la partie « Se documenter ».',
      count: 'Arbo. complète',
      path: '/admin/documentation/0',
    },
    {
      icon: 'megaphone',
      color: 'amber',
      title: 'Communication',
      description: 'Nouveautés, fiches pratiques, textes d\'accueil, contact.',
      count: '7 outils',
      path: '/admin/news/after-connexion',
    },
    {
      icon: 'news',
      color: 'orange',
      title: 'Actualités',
      description: 'Gestion des actualités et de leur affichage en page d\'accueil.',
      count: '2 outils',
      path: '/admin/actualites',
    },
    /*{
      icon: 'users',
      color: 'slate',
      title: 'Administrateurs',
      description: 'Gestion des administrateurs de l\'application.',
      count: 'Liste admin',
      path: '/admin/administrator',
    },*/
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {}

  public go(path: string): void {
    this.router.navigate([path]);
  }
}

import { Component, OnInit, ViewEncapsulation } from '@angular/core';

interface Release {
  number: string;
  date: string;
  changes: string[];
}

@Component({
  selector: 'app-version',
  templateUrl: './version.component.html',
  styleUrls: ['./version.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class VersionComponent implements OnInit {
  public searchText = '';

  // Tri décroissant par date (plus récent en haut)
  public releases: Release[] = [
    {
      number: '1.1.30', date: '2022-06-02',
      changes: ['Message pour remontée de version.'],
    },
    {
      number: '1.1.29', date: '2022-05-20',
      changes: ['Exporter les données hotline.'],
    },
    {
      number: '1.1.28', date: '2022-01-18',
      changes: ['Corriger statut demande.'],
    },
    {
      number: '1.1.27', date: '2021-12-13',
      changes: [
        'Corriger statut demande.',
        'Corriger script insertion des données dauphin.',
        'Changer ASIF DB instance.',
      ],
    },
    {
      number: '1.1.25', date: '2021-09-14',
      changes: [
        'Fixer problème de date fin de connexion.',
        'Merge de la branche fix_login dans master.',
        'Annuler partie acheteurs.',
      ],
    },
    {
      number: '1.1.244', date: '2021-04-01',
      changes: ['Ajout du « lien formulaire de la DAG ».'],
    },
    {
      number: '1.1.24', date: '2021-04-01',
      changes: ['Demande d\'ajout d\'un « lien organigrammes de la DAG ».'],
    },
    {
      number: '1.1.23', date: '2021-03-18',
      changes: ['Création d\'une rubrique dans « Contacter » et suppression d\'un lien en bas de page.'],
    },
    {
      number: '1.1.22', date: '2021-02-08',
      changes: ['Mise à jour de la relance à 15 jours au lieu de 5 jours.'],
    },
    {
      number: '1.1.21', date: '2020-12-08',
      changes: ['Mise à jour du script de chargement des contrats.'],
    },
    {
      number: '1.1.20', date: '2020-12-01',
      changes: [
        'Vérifier le champ email dans l\'interface de modification de hotline.',
        'Mettre à jour le document PDF.',
        'Sur Chrome, ne pas afficher le message de non-compatibilité de navigateur.',
      ],
    },
    {
      number: '1.1.19', date: '2020-11-30',
      changes: ['Modification de l\'URL de mise à jour d\'un hotline_email.'],
    },
    {
      number: '1.1.18', date: '2020-11-27',
      changes: [
        'Changement de l\'email de contact.',
        'Administration : possibilité de modifier un hotline_email.',
      ],
    },
    {
      number: '1.1.17', date: '2020-10-27',
      changes: ['Démo DevSecOps.'],
    },
    {
      number: '1.1.16', date: '2020-10-23',
      changes: ['Mise à jour du script pour exporter les données de la hotline. Ajout de la variable INSTANCEWEB ansible.'],
    },
    {
      number: '1.1.15', date: '2020-10-21',
      changes: ['Mise à jour du script pour exporter les données de la hotline.'],
    },
    {
      number: '1.1.14', date: '2020-10-14',
      changes: ['Mise à jour de la documentation.'],
    },
    {
      number: '1.1.13', date: '2020-10-05',
      changes: ['Mise à jour de la fonctionnalité d\'import de données. Fonctionnalité réservée au profil administrateur.'],
    },
    {
      number: '1.1.12', date: '2020-09-21',
      changes: ['Structure de la table item_generic : augmentation de la taille du champ « item_notice ».'],
    },
    {
      number: '1.1.11', date: '2020-09-17',
      changes: ['Première version de la fonctionnalité d\'import de données via fichier. Fonctionnalité réservée au profil administrateur.'],
    },
    {
      number: '1.1.10', date: '2020-08-25',
      changes: ['Mise à jour de l\'API d\'authentification pour permettre l\'accès à un compte nominatif.'],
    },
    {
      number: '1.1.9', date: '2020-07-21',
      changes: ['Mise à jour de la documentation.'],
    },
    {
      number: '1.1.8', date: '2020-07-21',
      changes: ['Ajout de l\'adresse mail du guichet de la DSIA pour la prise de contact.'],
    },
    {
      number: '1.1.7', date: '2020-07-21',
      changes: ['Modifications au niveau de la vue hotline.'],
    },
    {
      number: '1.1.6', date: '2020-07-20',
      changes: [
        'Début d\'ajout d\'une fonctionnalité pour mettre à jour une table à l\'aide d\'un fichier plat.',
        'Modifications au niveau de la vue hotline.',
      ],
    },
    {
      number: '1.1.5', date: '2020-06-17',
      changes: ['Augmentation de la taille de la colonne « message » de la table hotline_fil (de 500 à 5000 caractères).'],
    },
    {
      number: '1.1.4', date: '2020-06-16',
      changes: ['Mise en place d\'un script pour lancer automatiquement la clôture de fils de discussion trop anciens.'],
    },
    {
      number: '1.1.3', date: '2020-06-11',
      changes: ['Changement du proxy pour accéder au serveur IVALUA DAUPHIN.'],
    },
    {
      number: '1.1.2', date: '2020-06-09',
      changes: ['Mise en place de l\'alimentation automatique pour les articles génériques.'],
    },
    {
      number: '1.1.1', date: '2020-05-28',
      changes: [
        'Authentification : passage des identifiants via méthode POST (au lieu de GET).',
        'Récupération des données fournisseurs : suppression des fournisseurs avec blocage compta ou blocage achat.',
      ],
    },
    {
      number: '1.1.0', date: '2020-05-19',
      changes: ['Ajout de la fonctionnalité pour fermer automatiquement des fils de discussion.'],
    },
  ];

  constructor() { }

  ngOnInit(): void { }

  public get filteredReleases(): Release[] {
    const q = this.searchText.trim().toLowerCase();
    if (!q) return this.releases;
    return this.releases.filter(r =>
      r.number.toLowerCase().includes(q) ||
      r.date.toLowerCase().includes(q) ||
      r.changes.some(c => c.toLowerCase().includes(q))
    );
  }

  public onSearchChange(value: string): void {
    this.searchText = value;
  }
}

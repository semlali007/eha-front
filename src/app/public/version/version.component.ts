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
  public activeTab: 'front' | 'back' = 'front';

  // Tri décroissant par date (plus récent en haut)
  public releases: Release[] = [
    {
      number: '3.1.18', date: '2026-10-21',
      changes: [
        "Refonte moderne de l'en-tête, du pied de page et de la page d'accueil.",
        "Panneau Actualités repensé : grille de cartes et lecture du détail en plein bloc.",
        "Modernisation de la fenêtre de notifications.",
        "Nouvelle page « Notes de version » : chronologie et bascule front / back.",
        "Refonte de l'écran « Ancrage territorial ».",
        "Vitrine : recherche dans les filtres longs et filtres repliés par défaut.",
        "Nouvel écran d'administration : import automatique des fiches.",
        "Meilleure remontée des erreurs serveur (ex. fichier trop volumineux).",
        "Seuls les administrateurs peuvent créer une fiche marché.",
        "Synchronisation des bénéficiaires HLK : affichage amélioré et gestion des conflits en base.",
        "Renommage du libellé « Contrat groupe » en « Contrat ouvert aux filiales ».",
      ],
    },
    {
      number: '3.1.17', date: '2026-07-21',
      changes: ["Mise à jour du texte de présentation."],
    },
    {
      number: '3.1.16', date: '2026-07-15',
      changes: [
        "Nouvel écran de synchronisation des bénéficiaires (avec mode simulation).",
        "Désactivation de la synchronisation réelle par sécurité.",
        "Meilleure gestion de l'affichage lorsqu'un contrat est introuvable.",
        "Affichage enrichi des contrats et fournisseurs ; champ « accès au contrat ».",
      ],
    },
    {
      number: '3.1.15', date: '2026-06-19',
      changes: [
        "Fournisseurs : passage en liste déroulante et fenêtre de création / modification.",
        "Fiche marché : lien vers le contrat physique et meilleur remplissage du champ TVA.",
        "Amélioration du formulaire de satisfaction.",
        "Hotline : rôle administrateur pour clôturer une demande.",
        "Amélioration de l'export des fiches marché et de l'affichage des erreurs.",
        "Pages de documentation améliorées.",
      ],
    },
    {
      number: '3.1.14', date: '2026-05-11',
      changes: [
        "Amélioration des demandes hotline et du message de connexion.",
        "Correction de vulnérabilités de sécurité.",
      ],
    },
    {
      number: '3.1.13', date: '2026-05-04',
      changes: [
        "Refonte de la page de connexion.",
        "Amélioration de l'écran de satisfaction (administration) et de son formulaire.",
      ],
    },
    {
      number: '3.1.11', date: '2026-04-29',
      changes: [
        "Harmonisation de la pagination et de l'espace d'administration.",
        "Amélioration des écrans recherche, article générique, vue Dauphin et situation achat.",
        "Amélioration du formulaire d'ajout d'actualités.",
      ],
    },
    {
      number: '3.1.10', date: '2026-04-27',
      changes: [
        "Amélioration des écrans « Consulter un fournisseur » et « Consulter un contrat ».",
        "Fenêtres d'ajout de bénéficiaires / fournisseurs / entités retravaillées.",
        "Amélioration de l'ajout et de la modification d'une fiche marché.",
        "Amélioration de la page « Notes de version ».",
      ],
    },
    {
      number: '3.1.8', date: '2026-04-20',
      changes: [
        "Refonte de l'espace d'administration (tableau de bord, actualités, hotlines, documentation, fonctions de recherche).",
        "Nouveau filtre « numéro intracommunautaire ».",
        "Mémorisation des filtres au retour sur la liste des fiches.",
      ],
    },
    {
      number: '3.1.7', date: '2026-04-15',
      changes: [
        "Refonte de la page d'accueil, de l'en-tête (bandeau) et du pied de page.",
        "Fenêtre et page de notifications retravaillées.",
        "Amélioration des filtres, du loader et de l'affichage des résultats.",
        "Page « Ma situation achat » améliorée.",
      ],
    },
    {
      number: '3.1.6', date: '2026-03-04',
      changes: ["Correction de vulnérabilités de sécurité (Prototype Pollution, XSS côté client)."],
    },
    {
      number: '3.1.5', date: '2026-02-20',
      changes: ["Ajout d'une mention sur l'interface de connexion."],
    },
    {
      number: '3.1.4', date: '2026-01-16',
      changes: [
        "Correction d'une vulnérabilité de contrôle d'accès.",
        "Correction du filtre « brouillon ».",
      ],
    },
    {
      number: '3.1.3', date: '2025-10-08',
      changes: [
        "Mise à jour du libellé « Contrat ouvert aux filiales ».",
        "Gestion des rôles par filtrage sur le code département.",
      ],
    },
    {
      number: '3.1.1', date: '2025-08-28',
      changes: [
        "Ajout du filtre par date.",
        "Gestion des rôles par filtrage sur l'organisation.",
      ],
    },
    {
      number: '3.1.0', date: '2025-07-08',
      changes: [
        "Ajout d'un champ « zone géographique » sur le détail de fiche.",
        "Réorganisation des champs de la fiche et corrections (infobulles, zones, stockage local).",
      ],
    },
    {
      number: '3.0.9', date: '2024-07-16',
      changes: [
        "Vitrine de l'offre : champs « contrat groupe », « mise à jour de la donnée » et « taille fournisseur ».",
        "Gestion du mode d'affichage contrat groupe / normal.",
        "Corrections (historique de fiche, libellés).",
      ],
    },
    {
      number: '3.0.0', date: '2023-02-13',
      changes: [
        "Version majeure : notifications, commentaires de fiche, gestion des lots avec autocomplétion, stipulation pour autrui, enquête de satisfaction « à chaud ».",
        "Nombreuses améliorations d'affichage des fiches marché.",
      ],
    },
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

  // Versions côté serveur (back)
  public backReleases: Release[] = [
    {
      number: '3.1.14', date: '2026-09-15',
      changes: [
        "Création automatique des fiches marché depuis HLK (fusion ft_fiche_auto_v2).",
        "Filtre « contrat ouvert aux filiales » et gestion du retour HLK vide.",
        "Notification e-mail par acheteur.",
        "Renommage « Référence marché » → « Référence Cockpit ».",
        "Fusion des notions « Bénéficiaire » et « Stipulation pour autrui ».",
      ],
    },
    {
      number: '3.1.13', date: '2026-07-29',
      changes: [
        "Synchronisation des bénéficiaires : gestion des conflits, insensibilité aux accents et à la casse, délai d'attente porté à 60 s.",
        "Renommage « Contrat groupe » → « Contrat ouvert aux filiales ».",
      ],
    },
    {
      number: '3.1.12', date: '2026-07-21',
      changes: [
        "Correction du nom de table « sheet ».",
        "Mise à jour de la librairie SAML2 (4.19.2).",
        "Suppression du paramètre « signed_date ».",
      ],
    },
    {
      number: '3.1.11', date: '2026-07-01',
      changes: [
        "Ajout automatique des bénéficiaires.",
        "Correctifs de l'API HLK V2 en préproduction (dont contournement TLS).",
      ],
    },
    {
      number: '3.1.10', date: '2026-06-19',
      changes: [
        "Amélioration de la recherche de fiches.",
        "Évolution de l'objet fournisseur (SIREN, TVA, code NAF).",
        "Limitation de la récupération de la liste des fournisseurs.",
        "Amélioration de l'export des fiches marché.",
      ],
    },
    {
      number: '3.1.9', date: '2026-04-23',
      changes: ["Lot de corrections de bugs divers."],
    },
    {
      number: '3.1.8', date: '2026-04-20',
      changes: [
        "Export Excel : ajout de la colonne « Dernière modification ».",
        "Correction de l'accès aux actualités.",
        "Ajout du filtre « numéro de TVA intracommunautaire ».",
      ],
    },
    {
      number: '3.1.7', date: '2026-04-15',
      changes: ["Correctifs sur la recherche texte."],
    },
    {
      number: '3.1.6', date: '2026-03-04',
      changes: [
        "Corrections de sécurité : SSRF, Path Traversal (absolu et relatif), Stored XSS.",
        "Correction du motif SSO par département.",
      ],
    },
  ];

  constructor() { }

  ngOnInit(): void { }

  /** Liste affichée selon l'onglet actif (front / back). */
  public get currentReleases(): Release[] {
    return this.activeTab === 'back' ? this.backReleases : this.releases;
  }

  public setTab(tab: 'front' | 'back'): void {
    this.activeTab = tab;
  }

  public get filteredReleases(): Release[] {
    const q = this.searchText.trim().toLowerCase();
    if (!q) return this.currentReleases;
    return this.currentReleases.filter(r =>
      r.number.toLowerCase().includes(q) ||
      r.date.toLowerCase().includes(q) ||
      r.changes.some(c => c.toLowerCase().includes(q))
    );
  }

  public onSearchChange(value: string): void {
    this.searchText = value;
  }
}

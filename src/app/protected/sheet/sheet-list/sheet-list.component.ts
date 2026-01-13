import { Component, OnInit, ViewEncapsulation, OnDestroy, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Sheet } from 'src/app/shared/models/sheet';
import { SheetService } from 'src/app/core/services/sheet.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { User } from 'src/app/shared/models/user';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { PreviousService } from 'src/app/core/services/previous.service';
import { PageService } from 'src/app/core/services/page.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ViewModeService, ViewMode } from 'src/app/core/services/view-mode.service';


@Component({
  selector: 'app-sheet-list',
  templateUrl: './sheet-list.component.html',
  styleUrls: ['./sheet-list.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SheetListComponent implements OnInit, OnDestroy {
  sheets: Sheet[] = [];
  totalItems: number = 0;
  itemsPerPage: number = 20;
  paginationForm: FormGroup;
  smallnumPages: number = 0;
  welcomeText: SafeHtml;
  activeText = true;
  public user: User = null;
  private subscriptions: Subscription[] = [];
  public searchText = '';
  public searchProvider = '';
  public sortBy = 'date';
  public sortDirection = 'desc';
  public defaultFilter: any;
  public isSearch = false;
  public data: any = [];
  public filter = {
    subscribe: [],
    beneficiaries: [],
    stipulationAutrui: [],//
    edfOpen: [],
    partnership: [],
    sector: [],
    dauphin: [],
    areas: [],
    providers: [],
    status: [],
    directions: [],
    categories: [],
    committees: [],
    showcase: [],
    contratGroupe: [],
    miseAJourDonnee: [],
    supplierSize: []
  };

  public params: any = {
    page: 1,
    perpage: this.itemsPerPage,
    search: {
      searchText: this.searchText,
      searchProvider: this.searchProvider,
      subscribe: '',
      status: [],
      edf_open: '',
      partnership: '',
      protected_sector: '',
      dauphin: '',
      beneficiaries: [],
      stipulationAutrui: [],//
      areas: [],
      providers: [],
      directions: [],
      committees: [],
      showcase: '',
      contratGroupe: '',
      miseAJourDonnee: '',
      supplierSize: '',
      dateStart: '',
      dateEnd: ''
    },
    sortBy: this.sortBy,
    sortDirection: this.sortDirection
  };

  public filterInput: any = {
    subscribe: false,
    edfOpen: '',
    partnership: '',
    sector: '',
    dauphin: '',
    beneficiaries: [],
    stipulationAutrui: [],//
    providers: [],
    directions: [],
    categories: [],
    committees: [],
    status: [],
    areas: [],
    showcase: '',
    contratGroupe: '',
    miseAJourDonnee: '',
    dateStart: '',
    dateEnd: ''
  };


  constructor(
    private fb: FormBuilder,
    private sheetService: SheetService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private previousService: PreviousService,
    private pageService: PageService,
    private sanitizer: DomSanitizer,
    private viewModeService: ViewModeService
  ) { }

  ngOnInit() {
    // Initialiser d'abord le formulaire de pagination
    this.paginationForm = this.fb.group({
      'currentPage': 1,
    });

    const userSub = this.authService.user$.subscribe({
      next: (user) => this.user = user,
      error: (error) => console.error('Error in user subscription:', error)
    });
    this.subscriptions.push(userSub);

    // S'abonner aux changements de mode d'affichage
    const modeSub = this.viewModeService.mode$.subscribe(() => {
      this.applyViewMode();
      // Recharger les items après application du mode seulement si tout est initialisé
      if (this.user && this.paginationForm) {
        this.loadItems();
      }
    });
    this.subscriptions.push(modeSub);

    // Initialiser le defaultFilter AVANT d'appliquer le mode
    if (this.previousService.getPreviousUrl().includes('details')) {
      this.loadFilterFromStorage();
    } else {
      this.defaultFilter = this.params;
    }

    // Gestion des modes d'affichage - APRÈS l'initialisation du defaultFilter
    this.applyViewMode();

    this.loadItems();
    this.loadText();
  }

  get currentPage() { return this.paginationForm.get('currentPage') }

  public onsSubmittedSearchSheets(filter: any) {

    if ((!!filter.searchText && filter.searchText.length > 0)
      || (!!filter.searchProvider && filter.searchProvider.length > 0)) {
      this.initSortBy('rank', 'desc');
      this.isSearch = true;
    } else {
      this.isSearch = false;
      this.initSortBy('updated_at', 'desc');
    }
    this.initFilterInput();
    if (this.filterInput.beneficiaries) {
      this.filterInput.beneficiaries.forEach(element => {
        this.data.push(element);
      });
    }
    if (this.filterInput.stipulationAutrui) {//
      this.filterInput.stipulationAutrui.forEach(element => {
        this.data.push(element);
      });
    }
    this.searchText = filter.searchText;
    this.searchProvider = filter.searchProvider;
    if (this.currentPage.value !== 1) {
      this.currentPage.setValue(1);
    } else {
      this.loadItems();
    }
  }

  btnClick = function () {
    this.router.navigate(['app/hotline/create'], { queryParams: { theme: 'sheet' } });
  };


  public onSubmittedFilterSheets(filter: any) {
    // Gestion spéciale pour le filtre de date
    if (filter.key === 'dateRange') {
      this.filterInput.dateStart = filter.value.dateStart;
      this.filterInput.dateEnd = filter.value.dateEnd;
    } else {
      this.filterInput[filter.type] = filter.value;
    }
    
    this.isSearch = false;
    this.loadItems();
  }

  public onSubmittedGetSheet(id: any) {
    localStorage.setItem('params', JSON.stringify(this.params));
    this.router.navigate([`app/fiches/details/${id}`]);
  }

  public onChangedSort(sort: any) {
    if (!!sort && sort.sortBy) {
      let sortBy = sort.sortBy.split('_');
      this.sortBy = sortBy[0];
      this.sortDirection = sortBy[1];
      this.isSearch = false;
      this.loadItems();
    }
  }

  public loadItems() {

    let status = this.filterInput.status;
    if (!this.user || !(this.user.hasRole('EHA_ADMIN') || this.user.hasRole('EHA_GESTIONNAIRE'))) {
      status = 1;
    }
    this.params = {
      page: this.currentPage.value,
      perpage: this.itemsPerPage,
      isSearch: this.isSearch,
      search: {
        searchText: this.searchText,
        searchProvider: this.searchProvider,
        subscribe: this.filterInput.subscribe,
        status: status,
        edf_open: this.filterInput.edfOpen,
        partnership: this.filterInput.partnership,
        protected_sector: this.filterInput.sector,
        dauphin: this.filterInput.dauphin,
        beneficiaries: this.filterInput.beneficiaries,
        stipulationAutrui: this.filterInput.stipulationAutrui,//
        areas: this.filterInput.areas,
        providers: this.filterInput.providers,
        directions: this.filterInput.directions,
        categories: this.filterInput.categories,
        committees: this.filterInput.committees,
        showcase: this.filterInput.showcase,
        contratGroupe: this.filterInput.contratGroupe,
        miseAJourDonnee: this.filterInput.miseAJourDonnee,
        supplierSize: this.filterInput.supplierSize,
        dateStart: this.filterInput.dateStart,
        dateEnd: this.filterInput.dateEnd
      },
      sortBy: this.sortBy,
      sortDirection: this.sortDirection
    };

    this.sheetService.getSheets(this.params).subscribe({
      next: (data) => {
        this.totalItems = data.total;
        this.sheets = data.sheets;
        this.filter = data.filter;
      },
      error: (error) => {
        console.error('Error loading sheets:', error);
      }
    });

  }

  initFilterInput() {
    this.filterInput = {
      subscribe: '',
      edfOpen: '',
      partnership: '',
      sector: '',
      dauphin: '',
      beneficiaries: [],
      stipulationAutrui: [],
      providers: [],
      directions: [],
      categories: [],
      committees: [],
      status: [],
      areas: [],
      showcase: '',
      contratGroupe: '',
      miseAJourDonnee: '',
      supplierSize: []
    };
  }

  initSortBy(sortBy, sortDirection) {
    this.sortBy = sortBy;
    this.sortDirection = sortDirection;
  }

  public navigate(page: string): void {
    if (page === 'fiche_marchee_list') {
      this.router.navigate(['app/fiches/liste']);
    }
    else if (page === 'fiche_marchee') {
      this.router.navigate(['app/fiches/creation']);
    }
  }

  public pageChanged(event: any): void {
    this.currentPage.setValue(event.page);
    this.isSearch = false;
    this.loadItems();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => {
      if (sub) {
        sub.unsubscribe();
      }
    });
  }

  public loadFilterFromStorage() {
    this.defaultFilter = JSON.parse(localStorage.getItem('params'));
    if (!this.defaultFilter) {
      this.defaultFilter = this.params;
      return;
    }
    this.currentPage.setValue(this.defaultFilter.page);
    this.itemsPerPage = this.defaultFilter.perpage;
    this.searchText = this.defaultFilter.search.searchText || '';
    this.searchProvider = this.defaultFilter.search.searchProvider || '';
    this.sortBy = this.defaultFilter.sortBy;
    this.sortDirection = this.defaultFilter.sortDirection;
    this.filterInput = {
      subscribe: this.defaultFilter.search.subscribe || '',
      edfOpen: this.defaultFilter.search.edf_open || '',
      partnership: this.defaultFilter.search.partnership || '',
      sector: this.defaultFilter.search.protected_sector || '',
      dauphin: this.defaultFilter.search.dauphin || '',
      beneficiaries: this.defaultFilter.search.beneficiaries || [],
      stipulationAutrui: this.defaultFilter.search.stipulationAutrui || [],//
      providers: this.defaultFilter.search.providers || [],
      directions: this.defaultFilter.search.directions || [],
      categories: this.defaultFilter.search.categories || [],
      committees: this.defaultFilter.search.committees || [],
      status: this.defaultFilter.search.status || [],
      areas: this.defaultFilter.search.areas || [],
      showcase: this.defaultFilter.search.showcase || '',
      contratGroupe: this.defaultFilter.search.contratGroupe || '',
      miseAJourDonnee: this.defaultFilter.search.miseAJourDonnee || '',
      supplierSize: this.defaultFilter.search.supplierSize || []
    };
  }

  loadText() {
    this.pageService.getPage({ page: 'welcome-text' }).subscribe({
      next: (response) => {
        const originalText = response.content || '';
        this.welcomeText = this.sanitizer.bypassSecurityTrustHtml(this.getModifiedWelcomeText(originalText));
        this.activeText = response.active || false;
      },
      error: (error) => {
        console.error('Error loading welcome text:', error);
      }
    });
  }

  /**
   * Modifie le texte d'accueil selon le mode d'affichage
   */
  private getModifiedWelcomeText(originalText: string): string {
    if (this.isContratGroupeMode()) {
      // Remplacer "Vitrine de l'Offre" par "Vitrine de l'Offre (Contrat Groupe)"
      return originalText.replace(
        /Vitrine de l[''']Offre/gi,
        'Vitrine de l\'Offre (Contrat Groupe)'
      );
    }
    return originalText;
  }

  /**
   * Applique le mode d'affichage selon le service ViewMode
   */
  private applyViewMode(): void {
    const currentMode = this.viewModeService.getCurrentMode();

    if (currentMode === 'contrat-groupe') {
      // Appliquer automatiquement le filtre contrat groupe = true (le backend retourne "true" ou "false")
      this.filterInput.contratGroupe = 'true';
      // Appliquer le filtre immédiatement
      this.params.search.contratGroupe = 'true';
      // Mettre à jour aussi le defaultFilter pour que le composant de filtre affiche la bonne valeur
      if (this.defaultFilter && this.defaultFilter.search) {
        this.defaultFilter.search.contratGroupe = 'true';
      }
    } else {
      // Mode normal - pas de contrainte spéciale
      this.filterInput.contratGroupe = '';
      this.params.search.contratGroupe = '';

      // Remettre le defaultFilter à sa valeur normale
      if (this.defaultFilter && this.defaultFilter.search) {
        this.defaultFilter.search.contratGroupe = '';
      }
    }

    // Recharger le texte d'accueil pour refléter le nouveau mode
    this.loadText();
  }

  /**
   * Vérifie si on est en mode contrat groupe
   */
  public isContratGroupeMode(): boolean {
    return this.viewModeService.isContratGroupeMode();
  }

  /**
   * Vérifie si un champ doit être masqué en mode contrat groupe
   */
  public shouldHideFieldInContratGroupeMode(fieldName: string): boolean {
    if (!this.isContratGroupeMode()) {
      return false;
    }

    const hiddenFields = ['dauphin', 'directions', 'partnership', 'stipulationAutrui', 'committees', 'supplierSize'];
    return hiddenFields.includes(fieldName);
  }

  /**
   * Quitte le mode contrat groupe et revient au mode normal
   */
  public accederVitrineOffre(): void {
    this.viewModeService.setNormalMode();
  }
}

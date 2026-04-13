import {
  Component,
  OnInit,
  ViewEncapsulation,
  OnDestroy,
} from '@angular/core';
import { Router } from '@angular/router';
import { Sheet } from 'src/app/shared/models/sheet';
import { SheetService } from 'src/app/core/services/sheet.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { User } from 'src/app/shared/models/user';
import { Subscription, Subject } from 'rxjs';
import { skip } from 'rxjs/operators';
import { AuthService } from 'src/app/core/services/auth.service';
import { PreviousService } from 'src/app/core/services/previous.service';
import { PageService } from 'src/app/core/services/page.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SecurityContext } from '@angular/core';
import { ViewModeService } from 'src/app/core/services/view-mode.service';

@Component({
  selector: 'app-sheet-list',
  templateUrl: './sheet-list.component.html',
  styleUrls: ['./sheet-list.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class SheetListComponent implements OnInit, OnDestroy {
  sheets: Sheet[] = [];
  totalItems = 0;
  itemsPerPage = 20;
  smallnumPages = 0;
  paginationForm: FormGroup;
  welcomeText: SafeHtml;
  activeText = true;

  public user: User | null = null;
  public defaultFilter: any;
  public isSearch = false;
  public data: any[] = [];
  public searchText = '';
  public searchProvider = '';
  public sortBy = 'date';
  public sortDirection = 'desc';
  public reset$ = new Subject<void>();

  public filter = {
    subscribe: [],
    beneficiaries: [],
    stipulationAutrui: [],
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
    supplierSize: [],
  };

  public filterInput: any = {
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
    supplierSize: [],
    dateStart: '',
    dateEnd: '',
  };

  public params: any = {
    page: 1,
    perpage: this.itemsPerPage,
    search: {
      searchText: '',
      searchProvider: '',
      subscribe: '',
      status: [],
      edf_open: '',
      partnership: '',
      protected_sector: '',
      dauphin: '',
      beneficiaries: [],
      stipulationAutrui: [],
      areas: [],
      providers: [],
      directions: [],
      committees: [],
      showcase: '',
      contratGroupe: '',
      miseAJourDonnee: '',
      supplierSize: '',
      dateStart: '',
      dateEnd: '',
    },
    sortBy: this.sortBy,
    sortDirection: this.sortDirection,
  };

  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private sheetService: SheetService,
    private router: Router,
    private authService: AuthService,
    private previousService: PreviousService,
    private pageService: PageService,
    private sanitizer: DomSanitizer,
    private viewModeService: ViewModeService,
  ) {}

  ngOnInit(): void {
    this.paginationForm = this.fb.group({ currentPage: 1 });

    this.subscriptions.push(
      this.authService.user$.subscribe({
        next: (user) => (this.user = user),
        error: (err) => console.error('Error in user subscription:', err),
      }),
    );

    this.subscriptions.push(
      this.viewModeService.mode$.pipe(skip(1)).subscribe(() => {
        this.applyViewMode();
        if (this.user && this.paginationForm) {
          this.loadItems();
        }
      }),
    );

    if (this.previousService.getPreviousUrl().includes('details')) {
      this.loadFilterFromStorage();
    } else {
      this.defaultFilter = this.params;
    }

    this.applyViewMode();
    this.loadItems();
    this.loadText();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub?.unsubscribe());
    this.reset$.complete();
  }

  get currentPage() {
    return this.paginationForm.get('currentPage');
  }

  public onsSubmittedSearchSheets(filter: { searchText: string; searchProvider: string }): void {
    const hasText = filter.searchText?.length > 0 || filter.searchProvider?.length > 0;
    this.isSearch = hasText;
    this.initSortBy(hasText ? 'rank' : 'updated_at', 'desc');
    this.searchText = filter.searchText ?? '';
    this.searchProvider = filter.searchProvider ?? '';

    if (this.currentPage.value !== 1) {
      this.currentPage?.setValue(1);
    } else {
      this.loadItems();
    }
  }

  public onReset(): void {
    this.searchText = '';
    this.searchProvider = '';
    this.isSearch = false;
    this.initSortBy('updated_at', 'desc');
    this.resetFilterInput();
    this.reset$.next();
    this.currentPage?.setValue(1);
    this.loadItems();
  }

  public onClearedAllFilters(): void {
    this.resetFilterInput();
    this.isSearch = false;
    this.loadItems();
  }

  public onSubmittedFilterSheets(filter: any): void {
    if (filter.key === 'dateRange') {
      this.filterInput.dateStart = filter.value.dateStart;
      this.filterInput.dateEnd = filter.value.dateEnd;
    } else {
      this.filterInput[filter.type] = filter.value;
    }
    this.isSearch = false;
    this.loadItems();
  }

  public onSubmittedGetSheet(id: any): void {
    localStorage.setItem('params', JSON.stringify(this.params));
    this.router.navigate([`app/fiches/details/${id}`]);
  }

  public onChangedSort(sort: any): void {
    if (sort?.sortBy) {
      const [sortBy, sortDirection] = sort.sortBy.split('_');
      this.sortBy = sortBy;
      this.sortDirection = sortDirection;
      this.isSearch = false;
      this.loadItems();
    }
  }

  public pageChanged(event: any): void {
    this.currentPage?.setValue(event.page);
    this.isSearch = false;
    this.loadItems();
  }

  public loadItems(): void {
    const status =
      !this.user ||
      !(this.user.hasRole('EHA_ADMIN') || this.user.hasRole('EHA_GESTIONNAIRE'))
        ? 1
        : this.filterInput.status;

    this.params = {
      page: this.currentPage.value,
      perpage: this.itemsPerPage,
      isSearch: this.isSearch,
      search: {
        searchText: this.searchText,
        searchProvider: this.searchProvider,
        subscribe: this.filterInput.subscribe,
        status,
        edf_open: this.filterInput.edfOpen,
        partnership: this.filterInput.partnership,
        protected_sector: this.filterInput.sector,
        dauphin: this.filterInput.dauphin,
        beneficiaries: this.filterInput.beneficiaries,
        stipulationAutrui: this.filterInput.stipulationAutrui,
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
        dateEnd: this.filterInput.dateEnd,
      },
      sortBy: this.sortBy,
      sortDirection: this.sortDirection,
    };

    this.sheetService.getSheets(this.params).subscribe({
      next: (data) => {
        if (data && data.sheets) {
          this.totalItems = data.total;
          this.sheets = data.sheets;
          this.filter = data.filter;
        }
      },
      error: () => {
        this.sheets = [];
        this.totalItems = 0;
      },
    });
  }

  public isContratGroupeMode(): boolean {
    return this.viewModeService.isContratGroupeMode();
  }

  public shouldHideFieldInContratGroupeMode(fieldName: string): boolean {
    if (!this.isContratGroupeMode()) return false;
    return ['dauphin', 'directions', 'partnership', 'stipulationAutrui', 'committees', 'supplierSize']
      .includes(fieldName);
  }

  public accederVitrineOffre(): void {
    this.viewModeService.setNormalMode();
    this.resetFilterInput();
    this.reset$.next();
    this.loadItems();
  }

  public navigate(page: string): void {
    if (page === 'fiche_marchee_list') {
      this.router.navigate(['app/fiches/liste']);
    } else if (page === 'fiche_marchee') {
      this.router.navigate(['app/fiches/creation']);
    }
  }

  private resetFilterInput(): void {
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
      supplierSize: [],
      dateStart: '',
      dateEnd: '',
    };
  }

  private initSortBy(sortBy: string, sortDirection: string): void {
    this.sortBy = sortBy;
    this.sortDirection = sortDirection;
  }

  private applyViewMode(): void {
    const isContratGroupe = this.viewModeService.getCurrentMode() === 'contrat-groupe';
    const value = isContratGroupe ? 'true' : '';

    this.filterInput.contratGroupe = value;
    this.params.search.contratGroupe = value;
    if (this.defaultFilter?.search) {
      this.defaultFilter.search.contratGroupe = value;
    }

    this.loadText();
  }

  private loadText(): void {
    this.pageService.getPage({ page: 'welcome-text' }).subscribe({
      next: (response) => {
        const originalText = response.content || '';
        this.welcomeText =
          this.sanitizer.sanitize(
            SecurityContext.HTML,
            this.isContratGroupeMode()
              ? originalText.replace(/Vitrine de l[''']Offre/gi, "Vitrine de l'Offre (Contrat Groupe)")
              : originalText,
          ) || '';
        this.activeText = response.active || false;
      },
      error: (err) => console.error('Error loading welcome text:', err),
    });
  }

  private loadFilterFromStorage(): void {
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
      stipulationAutrui: this.defaultFilter.search.stipulationAutrui || [],
      providers: this.defaultFilter.search.providers || [],
      directions: this.defaultFilter.search.directions || [],
      categories: this.defaultFilter.search.categories || [],
      committees: this.defaultFilter.search.committees || [],
      status: this.defaultFilter.search.status || [],
      areas: this.defaultFilter.search.areas || [],
      showcase: this.defaultFilter.search.showcase || '',
      contratGroupe: this.defaultFilter.search.contratGroupe || '',
      miseAJourDonnee: this.defaultFilter.search.miseAJourDonnee || '',
      supplierSize: this.defaultFilter.search.supplierSize || [],
      dateStart: this.defaultFilter.search.dateStart || '',
      dateEnd: this.defaultFilter.search.dateEnd || '',
    };
  }
}

import { Component, OnInit, ViewEncapsulation, OnDestroy, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Sheet } from 'src/app/shared/models/sheet';
import { SheetService } from 'src/app/core/services/sheet.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { User } from 'src/app/shared/models/user';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { PreviousService } from 'src/app/core/services/previous.service';
import { PageService } from 'src/app/core/services/page.service';


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
  welcomeText = '';
  activeText = true;
  public user: User = null;
  public subscription: Subscription;
  public searchText = '';
  public searchProvider = '';
  public sortBy = 'date';
  public sortDirection = 'desc';
  public defaultFilter: any;
  public data:any = [];
  public filter = {
    subscribe: [],
    beneficiaries: [],
    edfOpen: [],
    partnership: [],
    sector: [],
    dauphin: [],
    areas: [],
    providers: [],
    status: [],
    directions: [],
    committees: [],
    showcase: []
  };

  public params: any = {
    page: 1,
    perpage: this.itemsPerPage,
    search: {
      searchText: this.searchText,
      searchProvider: this.searchProvider,
      subscribe: '',
      status:  [],
      edf_open: '',
      partnership: '',
      protected_sector: '',
      dauphin: '',
      beneficiaries: [],
      areas: [],
      providers: [],
      directions: [],
      committees: [],
      showcase: ''
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
    providers: [],
    directions: [],
    committees: [],
    status:  [],
    areas: [],
    showcase: ''
  };


  constructor(
    private fb: FormBuilder,
    private sheetService: SheetService,
    private router: Router,
    private authService: AuthService,
    private previousService: PreviousService,
    private pageService: PageService,

  ) { }

  ngOnInit() {
    this.subscription = this.authService.user$.subscribe(user => this.user = user);
    this.paginationForm = this.fb.group({
      'currentPage': 1,
    });

    if (this.previousService.getPreviousUrl().includes('details')) {
      this.loadFilterFromStorage();
    } else {
      this.defaultFilter = this.params;
    }
    this.loadItems();
    this.loadText();
  }

  get currentPage() { return this.paginationForm.get('currentPage') }

  public onsSubmittedSearchSheets(filter: any) {
    
    if((!!filter.searchText && filter.searchText.length>0)
      ||  (!!filter.searchProvider && filter.searchProvider.length>0)){
        this.initSortBy('rank', 'desc');
      }else{
        this.initSortBy('updated_at', 'desc');
      }
      
    this.initFilterInput();
    if(this.filterInput.beneficiaries) {
      this.filterInput.beneficiaries.forEach(element => {
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
    this.filterInput[filter.type] = filter.value;
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
      this.loadItems();
    }
  }

  public loadItems() {
    let status = this.filterInput.status;
    if (!this.user || !(this.user.hasRole('EHA_ADMIN') || this.user.hasRole('EHA_GESTIONNAIRE')) ) {
      status = 1;
    }
    this.params = {
      page: this.currentPage.value,
      perpage: this.itemsPerPage,
      search: {
        searchText: this.searchText,
        searchProvider: this.searchProvider,
        subscribe: this.filterInput.subscribe,
        status: this.filterInput.status,
        edf_open: this.filterInput.edfOpen,
        partnership: this.filterInput.partnership,
        protected_sector: this.filterInput.sector,
        dauphin: this.filterInput.dauphin,
        beneficiaries: this.filterInput.beneficiaries,
        areas: this.filterInput.areas,
        providers: this.filterInput.providers,
        directions: this.filterInput.directions,
        committees: this.filterInput.committees,
        showcase: this.filterInput.showcase
      },
      sortBy: this.sortBy,
      sortDirection: this.sortDirection
    };

    this.sheetService.getSheets(this.params).subscribe(
      data => {
        this.totalItems = data.total;
        this.sheets = data.sheets;
        this.filter = data.filter;
      }
    );

  }

  initFilterInput() {
    this.filterInput = {
      subscribe: '',
      edfOpen: '',
      partnership: '',
      sector: '',
      dauphin: '',
      beneficiaries: [],
      providers: [],
      directions: [],
      committees: [],
      status:  [],
      areas: [],
      showcase: ''
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
    this.loadItems();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public loadFilterFromStorage() {
    this.defaultFilter = JSON.parse(localStorage.getItem('params'));
    this.currentPage.setValue(this.defaultFilter.page);
    this.itemsPerPage = this.defaultFilter.perpage;
    this.searchText = this.defaultFilter.search.searchText;
    this.searchProvider = this.defaultFilter.search.searchProvider;
    this.sortBy = this.defaultFilter.sortBy;
    this.sortDirection = this.defaultFilter.sortDirection;
    this.filterInput = {
      subscribe: this.defaultFilter.search.subscribe,
      edfOpen: this.defaultFilter.search.edf_open,
      partnership: this.defaultFilter.search.partnership,
      sector: this.defaultFilter.search.protected_sector,
      dauphin: this.defaultFilter.search.dauphin,
      beneficiaries: this.defaultFilter.search.beneficiaries,
      providers: this.defaultFilter.search.providers,
      directions: this.defaultFilter.search.directions,
      committees: this.defaultFilter.search.committees,
      status: this.defaultFilter.search.status,
      areas: this.defaultFilter.search.areas,
      showcase: this.defaultFilter.search.showcase
    };
  }

  loadText() {
    this.pageService.getPage({ page: 'welcome-text' }).subscribe(response => {
      this.welcomeText = response.content || '';
      this.activeText = response.active || false;
    })
  }
}

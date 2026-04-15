import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  Input,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription, Subject } from 'rxjs';
import { ViewModeService } from 'src/app/core/services/view-mode.service';

@Component({
  selector: 'app-sheet-list-filter',
  templateUrl: './sheet-list-filter.component.html',
  styles: [],
})
export class SheetListFilterComponent implements OnInit, OnDestroy, OnChanges {
  sheetFilterForm: FormGroup;

  @Input() defaultFilter: any;
  @Input() user: any = {};
  @Input() data: any;
  @Input() filter: any = {
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
    showcase: [],
    categories: [],
    committees: [],
    contratGroupe: [],
    miseAJourDonnee: [],
    supplierSize: [],
  };
  @Input() reset$: Subject<void> | null = null;

  @Output() submittedFilterSheets = new EventEmitter<Object>();
  @Output() clearedAllFilters = new EventEmitter<void>();

  public resetFilters$ = new Subject<void>();
  public allCollapsed = false;
  public hasActiveDate = false;

  @ViewChild('filterSections', { static: false }) filterSections!: ElementRef;

  private subscriptions = new Subscription();

  constructor(
    private fb: FormBuilder,
    private viewModeService: ViewModeService,
  ) {}

  get subscribe() { return this.sheetFilterForm.get('subscribe'); }
  get edfOpen() { return this.sheetFilterForm.get('edfOpen'); }
  get partnership() { return this.sheetFilterForm.get('partnership'); }
  get sector() { return this.sheetFilterForm.get('sector'); }
  get dauphin() { return this.sheetFilterForm.get('dauphin'); }
  get beneficiaries() { return this.sheetFilterForm.get('beneficiaries'); }
  get stipulationAutrui() { return this.sheetFilterForm.get('stipulationAutrui'); }
  get areas() { return this.sheetFilterForm.get('areas'); }
  get providers() { return this.sheetFilterForm.get('providers'); }
  get directions() { return this.sheetFilterForm.get('directions'); }
  get status() { return this.sheetFilterForm.get('status'); }
  get showcase() { return this.sheetFilterForm.get('showcase'); }
  get categories() { return this.sheetFilterForm.get('categories'); }
  get committees() { return this.sheetFilterForm.get('committees'); }
  get contratGroupe() { return this.sheetFilterForm.get('contratGroupe'); }
  get miseAJourDonnee() { return this.sheetFilterForm.get('miseAJourDonnee'); }
  get supplierSize() { return this.sheetFilterForm.get('supplierSize'); }

  ngOnInit(): void {
    if (this.reset$) {
      this.subscriptions.add(
        this.reset$.subscribe(() => this.resetForm()),
      );
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['defaultFilter'] && changes['defaultFilter'].currentValue) {
      this.initForm();
      const d = changes['defaultFilter'].currentValue;
      this.hasActiveDate = !!(d.dateStart || d.dateEnd);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  initForm(): void {
    const d = this.defaultFilter;
    this.sheetFilterForm = this.fb.group({
      edfOpen: [d?.edf_open || 'all'],
      subscribe: [d?.subscribe || false],
      partnership: [d?.partnership || 'all'],
      sector: [d?.protected_sector || 'all'],
      dauphin: [d?.dauphin || 'all'],
      beneficiaries: [d?.beneficiaries || []],
      stipulationAutrui: [d?.stipulationAutrui || []],
      areas: [d?.areas || []],
      providers: [d?.providers || []],
      directions: [d?.directions || []],
      categories: [d?.categories || []],
      committees: [d?.committees || []],
      status: [d?.status || []],
      showcase: [d?.showcase || 'all'],
      contratGroupe: [d?.contratGroupe || 'all'],
      miseAJourDonnee: [d?.miseAJourDonnee || 'all'],
      supplierSize: [d?.supplierSize || []],
    });
  }

  resetForm(): void {
    this.sheetFilterForm = this.fb.group({
      subscribe: [false],
      edfOpen: ['all'],
      partnership: ['all'],
      sector: ['all'],
      dauphin: ['all'],
      beneficiaries: [[]],
      stipulationAutrui: [[]],
      areas: [[]],
      providers: [[]],
      directions: [[]],
      categories: [[]],
      committees: [[]],
      status: [[]],
      showcase: ['all'],
      contratGroupe: ['all'],
      miseAJourDonnee: ['all'],
      supplierSize: [[]],
    });
    this.hasActiveDate = false;
    this.resetFilters$.next();
  }

  clearAll(): void {
    this.resetForm();
    this.clearedAllFilters.emit();
  }

  onChangedFilterSheets(itemFilter: any): void {
    this.submittedFilterSheets.emit(itemFilter);
  }

  onDateFiltersChange(dateFilters: { dateStart: string; dateEnd: string }): void {
    this.hasActiveDate = !!(dateFilters.dateStart || dateFilters.dateEnd);
    this.submittedFilterSheets.emit({ key: 'dateRange', value: dateFilters });
  }

  get activeFilterCount(): number {
    const f = this.sheetFilterForm?.value;
    if (!f) return 0;
    let count = 0;
    if (f.subscribe) count++;
    if (f.edfOpen != null && f.edfOpen !== 'all') count++;
    if (f.partnership != null && f.partnership !== 'all') count++;
    if (f.sector != null && f.sector !== 'all') count++;
    if (f.dauphin != null && f.dauphin !== 'all') count++;
    if (f.showcase != null && f.showcase !== 'all') count++;
    if (f.contratGroupe != null && f.contratGroupe !== 'all') count++;
    if (f.miseAJourDonnee != null && f.miseAJourDonnee !== 'all') count++;
    if (f.beneficiaries?.length) count++;
    if (f.stipulationAutrui?.length) count++;
    if (f.areas?.length) count++;
    if (f.providers?.length) count++;
    if (f.directions?.length) count++;
    if (f.categories?.length) count++;
    if (f.committees?.length) count++;
    if (f.status?.length) count++;
    if (this.hasActiveDate) count++;
    return count;
  }

  toggleAll(): void {
    this.allCollapsed = !this.allCollapsed;
    if (!this.filterSections) return;
    const headers = this.filterSections.nativeElement.querySelectorAll('.filter-header');
    headers.forEach((header: HTMLElement) => {
      const expanded = header.getAttribute('aria-expanded') === 'true';
      if (this.allCollapsed && expanded) {
        header.click();
      } else if (!this.allCollapsed && !expanded) {
        header.click();
      }
    });
  }

  shouldHideFilterInContratGroupeMode(filterName: string): boolean {
    if (!this.viewModeService.isContratGroupeMode()) {
      return false;
    }
    return ['dauphin', 'directions', 'partnership', 'stipulationAutrui', 'committees', 'supplierSize']
      .includes(filterName);
  }
}

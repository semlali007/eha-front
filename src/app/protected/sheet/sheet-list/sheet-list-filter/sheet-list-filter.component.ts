import { Component, EventEmitter, OnInit, Output, Input, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MessageService } from 'src/app/core/services/message.service';
import { ViewModeService } from 'src/app/core/services/view-mode.service';
@Component({
  selector: 'app-sheet-list-filter',
  templateUrl: './sheet-list-filter.component.html',
  styles: [
  ]
})

export class SheetListFilterComponent implements OnInit, OnDestroy, OnChanges  {
  sheetFilterForm: FormGroup;
  @Input() defaultFilter : any;
  @Input() user : any = {};
  @Input() data : any;
  @Input() filter: any = {
    subscribe: [],
    beneficiaries: [],
    stipulationAutrui: [],//**** */
    edfOpen: [],
    partnership: [],
    sector: [],
    dauphin: [],
    areas:[],
    providers:[],
    status:[],
    directions:[],
    showcase: [],
    committees: [],
    contratGroupe: [],
    miseAJourDonnee: [],
    supplierSize: []
  };
  public subscription: Subscription;
  @Output() submittedFilterSheets = new EventEmitter<Object>();
  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private viewModeService: ViewModeService
  ) {
  }

  get subscribe() { return this.sheetFilterForm.get('subscribe') }
  get edfOpen() { return this.sheetFilterForm.get('edfOpen') }
  get partnership() { return this.sheetFilterForm.get('partnership') }
  get sector() { return this.sheetFilterForm.get('sector') }
  get dauphin() { return this.sheetFilterForm.get('dauphin') }
  get beneficiaries() { return this.sheetFilterForm.get('beneficiaries') }
  get stipulationAutrui() { return this.sheetFilterForm.get('stipulationAutrui')} // ***
  get areas() { return this.sheetFilterForm.get('areas') }
  get providers() { return this.sheetFilterForm.get('providers') }
  get directions() { return this.sheetFilterForm.get('directions') }
  get status() { return this.sheetFilterForm.get('status') }
  get showcase() { return this.sheetFilterForm.get('showcase') }
  get committees() { return this.sheetFilterForm.get('committees') }
  get contratGroupe() { return this.sheetFilterForm.get('contratGroupe') }
  get miseAJourDonnee() { return this.sheetFilterForm.get('miseAJourDonnee') }
  get supplierSize() { return this.sheetFilterForm.get('supplierSize') }

  ngOnInit(): void {
    this.initForm();
    this.subscription = this.messageService.getMessage().subscribe({
      next: (init) => {
        if (!!init && !!init.initSheetFilter && (init.initSheetFilter === true)) {
          this.resetForm();
        }
      },
      error: (error) => {
        console.error('Error in message service subscription:', error);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['defaultFilter'] && changes['defaultFilter'].currentValue) {
      this.initForm();
    }
  }
  initForm() {
    this.sheetFilterForm = this.fb.group({
      'edfOpen': [(this.defaultFilter?.edf_open === '' || !this.defaultFilter?.edf_open) ? 'all' : this.defaultFilter.edf_open],
      'subscribe': [(this.defaultFilter?.subscribe === '' || !this.defaultFilter?.subscribe) ? false : this.defaultFilter.subscribe],
      'partnership': [(this.defaultFilter?.partnership === '' || !this.defaultFilter?.partnership) ? 'all' : this.defaultFilter.partnership],
      'sector': [(this.defaultFilter?.protected_sector === '' || !this.defaultFilter?.protected_sector) ? 'all' : this.defaultFilter.protected_sector],
      'dauphin': [(this.defaultFilter?.dauphin === '' || !this.defaultFilter?.dauphin) ? 'all' : this.defaultFilter.dauphin],
      'beneficiaries': [this.defaultFilter?.beneficiaries || []],
      'stipulationAutrui': [this.defaultFilter?.stipulationAutrui || []],//*** */
      'areas': [this.defaultFilter?.areas || []],
      'providers': [this.defaultFilter?.providers || []],
      'directions': [this.defaultFilter?.directions || []],
      'committees': [this.defaultFilter?.committees || []],
      'status': [this.defaultFilter?.status || []],
      'showcase': [(this.defaultFilter?.showcase === '' || !this.defaultFilter?.showcase) ? 'all' : this.defaultFilter.showcase],
      'contratGroupe': [(this.defaultFilter?.contratGroupe === '' || !this.defaultFilter?.contratGroupe) ? 'all' : this.defaultFilter.contratGroupe],
      'miseAJourDonnee': [(this.defaultFilter?.miseAJourDonnee === '' || !this.defaultFilter?.miseAJourDonnee) ? 'all' : this.defaultFilter.miseAJourDonnee],
      'supplierSize': [this.defaultFilter?.supplierSize || []]
    });
  }

  resetForm() {
    this.sheetFilterForm = this.fb.group({
      'subscribe': [false],
      'edfOpen': ['all'],
      'partnership': ['all'],
      'sector': ['all'],
      'dauphin': ['all'],
      'beneficiaries': [[]],
      'stipulationAutrui': [[]],
      'areas': [[]],
      'providers': [[]],
      'directions': [[]],
      'committees': [[]],
      'status': [[]],
      'showcase': ['all'],
      'contratGroupe': ['all'],
      'miseAJourDonnee': ['all'],
      'supplierSize': [[]]
    });
  }
  
  onChangedFilterSheets(itemFilter) {
    this.submittedFilterSheets.emit(itemFilter);
  }

  /**
   * Vérifie si un filtre doit être masqué en mode contrat groupe
   */
  public shouldHideFilterInContratGroupeMode(filterName: string): boolean {
    if (!this.viewModeService.isContratGroupeMode()) {
      return false;
    }
    
    const hiddenFilters = ['dauphin', 'directions', 'partnership', 'stipulationAutrui', 'committees', 'supplierSize'];
    return hiddenFilters.includes(filterName);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}

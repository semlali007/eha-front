import { Component, EventEmitter, OnInit, Output, Input,OnDestroy, SimpleChange } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MessageService } from 'src/app/core/services/message.service';
@Component({
  selector: 'app-sheet-list-filter',
  templateUrl: './sheet-list-filter.component.html',
  styles: [
  ]
})

export class SheetListFilterComponent implements OnInit, OnDestroy  {
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
    contratGroupe: []
  };
  public subscription: Subscription;
  @Output() submittedFilterSheets = new EventEmitter<Object>();
  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
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

  ngOnChange(changes:SimpleChange) {
  }
  initForm() {
    this.sheetFilterForm = this.fb.group({
      'edfOpen': [(this.defaultFilter?.search?.edf_open === '' || !this.defaultFilter?.search?.edf_open) ? 'all' : this.defaultFilter.search.edf_open],
      'subscribe': [(this.defaultFilter?.search?.subscribe === '' || !this.defaultFilter?.search?.subscribe) ? false : this.defaultFilter.search.subscribe],
      'partnership': [(this.defaultFilter?.search?.partnership === '' || !this.defaultFilter?.search?.partnership) ? 'all' : this.defaultFilter.search.partnership],
      'sector': [(this.defaultFilter?.search?.protected_sector === '' || !this.defaultFilter?.search?.protected_sector) ? 'all' : this.defaultFilter.search.protected_sector],
      'dauphin': [(this.defaultFilter?.search?.dauphin === '' || !this.defaultFilter?.search?.dauphin) ? 'all' : this.defaultFilter.search.dauphin],
      'beneficiaries': [this.defaultFilter?.search?.beneficiaries || []],
      'stipulationAutrui': [this.defaultFilter?.search?.stipulationAutrui || []],//*** */
      'areas': [this.defaultFilter?.search?.areas || []],
      'providers': [this.defaultFilter?.search?.providers || []],
      'directions': [this.defaultFilter?.search?.directions || []],
      'committees': [this.defaultFilter?.search?.committees || []],
      'status': [this.defaultFilter?.search?.status || []],
      'showcase': [(this.defaultFilter?.search?.showcase === '' || !this.defaultFilter?.search?.showcase) ? 'all' : this.defaultFilter.search.showcase],
      'contratGroupe': [(this.defaultFilter?.search?.contratGroupe === '' || !this.defaultFilter?.search?.contratGroupe) ? 'all' : this.defaultFilter.search.contratGroupe]
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
      'contratGroupe': ['all']
    });
  }
  
  onChangedFilterSheets(itemFilter) {
    this.submittedFilterSheets.emit(itemFilter);
  }


  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}

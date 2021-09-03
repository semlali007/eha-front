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
    beneficiaries: [],
    edfOpen: [],
    partnership: [],
    sector: [],
    dauphin: [],
    areas:[],
    providers:[],
    status:[],
    directions:[],
    showcase: []
  };
  public subscription: Subscription;
  @Output() submittedFilterSheets = new EventEmitter<Object>();
  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
  ) {
  }

  get edfOpen() { return this.sheetFilterForm.get('edfOpen') }
  get partnership() { return this.sheetFilterForm.get('partnership') }
  get sector() { return this.sheetFilterForm.get('sector') }
  get dauphin() { return this.sheetFilterForm.get('dauphin') }
  get beneficiaries() { return this.sheetFilterForm.get('beneficiaries') }
  get areas() { return this.sheetFilterForm.get('areas') }
  get providers() { return this.sheetFilterForm.get('providers') }
  get directions() { return this.sheetFilterForm.get('directions') }
  get status() { return this.sheetFilterForm.get('status') }
  get showcase() { return this.sheetFilterForm.get('showcase') }
  
  ngOnInit(): void {
    this.initForm();
    this.subscription = this.messageService.getMessage().subscribe((init) => {
      if (!!init && !!init.initSheetFilter && (init.initSheetFilter === true)) {
        this.resetForm();
      }
    });
  }

  ngOnChange(changes:SimpleChange) {
  }
  initForm() {
    this.sheetFilterForm = this.fb.group({
      'edfOpen': [(this.defaultFilter.edf_open === '') ? 'all' : this.defaultFilter.edf_open],
      'partnership': [(this.defaultFilter.partnership === '') ? 'all' : this.defaultFilter.partnership],
      'sector': [(this.defaultFilter.protected_sector === '') ? 'all' : this.defaultFilter.protected_sector],
      'dauphin': [(this.defaultFilter.dauphin === '') ? 'all' : this.defaultFilter.dauphin],
      'beneficiaries': [this.defaultFilter.beneficiaries],
      'areas': [this.defaultFilter.areas],
      'providers': [this.defaultFilter.providers],
      'directions': [this.defaultFilter.directions],
      'status': [(this.defaultFilter.status === '') ? 'all' : this.defaultFilter.status],
      'showcase': [(this.defaultFilter.showcase === '') ? 'all' : this.defaultFilter.showcase]
    });
  }

  resetForm() {
    this.sheetFilterForm = this.fb.group({
      'edfOpen': ['all'],
      'partnership': ['all'],
      'sector': ['all'],
      'dauphin': ['all'],
      'beneficiaries': [this.defaultFilter.beneficiaries],
      'areas': [[]],
      'providers': [[]],
      'directions': [[]],
      'status': ['all'],
      'showcase': ['all']
    });
  }
  
  onChangedFilterSheets(itemFilter) {
    this.submittedFilterSheets.emit(itemFilter);
  }


  ngOnDestroy() {
    this.subscription.unsubscribe();
   }
}

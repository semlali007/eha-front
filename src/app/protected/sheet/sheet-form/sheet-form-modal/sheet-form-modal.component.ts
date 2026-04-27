import { Component, Input, EventEmitter, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-sheet-form-modal',
  templateUrl: './sheet-form-modal.component.html',
  styleUrls: ['./sheet-form-modal.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class SheetFormModalComponent implements OnInit {
  @ViewChild('autoShownModal', { static: false }) autoShownModal?: ModalDirective;
  isModalShown :boolean;
  modalMessage = '';
  smallnumPages: number ;
  sheetModalForm: FormGroup;
  searchModalForm: FormGroup;
  type:string='';
  title: string;
  items: any[];
  maxSize : number;
  itemsPerPage: number;
  selectedValues: any[];
  placeholder: string;
  public event: EventEmitter<any> = new EventEmitter();
  public eventPaginate: EventEmitter<any> = new EventEmitter();
  public addElementEvent: EventEmitter<any> = new EventEmitter();
  public removeElementEvent: EventEmitter<any> = new EventEmitter();
  public runRemoveElementEvent: EventEmitter<any> = new EventEmitter();
  
  total: number;
  page: number;
  toRemoveId:string;
  closeBtnName: string;
  allitems: any = [];
  names: string[];
  @Input() selectedItems: FormControl;
  bsConfirmModalRef?: BsModalRef;
  constructor(
    public bsModalRef: BsModalRef,
    private fb: FormBuilder
  ) { }
  public requestAutocompleteItems: any;
  get currentPage() { return this.sheetModalForm.get('currentPage') }
  get search() { return this.searchModalForm.get('search') }
  ngOnInit() {
    this.selectedItems = new FormControl();
    this.selectedItems.setValue(this.selectedValues);
    this.sheetModalForm = this.createsheetModalForm();
    this.searchModalForm = this.createSearchModalForm();
    this.names = this.allitems.map(t=>t.name);
  }
  get newItem() { return this.sheetModalForm.get('newItem') }
  createsheetModalForm(): FormGroup {
    return this.sheetModalForm = this.fb.group({
      'newItem': ['', [
        Validators.required,
      ]],
      'currentPage': 1
    });
  }
  createSearchModalForm(): FormGroup {
    return this.searchModalForm = this.fb.group({
      'search': [''],
    });
  }

  validateModal() {
    this.triggerEvent(this.selectedItems);
    this.bsModalRef.hide();
  }

  triggerEvent(item: any) {
    this.event.emit({ data: item });
  }

  submit(): void {
    this.addElementEvent.emit({ data: this.newItem });
    this.newItem.setValue('');
  }

  submitSearch(): void {
    this.currentPage.setValue(1);
    this.eventPaginate.emit({ data: { page: 1, search: this.search.value } });
  }

  addItemToList($event): void {
    let exist = false;
    this.selectedItems.value.forEach(element => {
      if (element.code == $event.code) {
        exist = true;
      }
    });
    if (exist == false) {
      this.selectedItems.value.push({
        code: $event.code,
        label: $event.label,
        display: $event.label,
        value: $event.label,
      })
    }
  }

  remove($event): void {
    this.removeElementEvent.emit({ data: $event });
  }

  pageChanged(event: any): void {
    this.currentPage.setValue(event.page);
    this.eventPaginate.emit({ data: { page: this.currentPage.value, search: this.search.value } });
  }
  
  confirm(): void {
    this.hideModal();   
    this.runRemoveElementEvent.emit({ data: {id:this.toRemoveId} });
  }
 
  decline(): void {
    this.hideModal();  
  }
 
  hideModal(): void {
    this.autoShownModal?.hide();
    this.isModalShown= false;
  }

  removeItemFromList(code): void {
    this.selectedItems.value.forEach((element,index) => {
      if (element.code == code) {
        this.selectedItems.value.splice(index, 1);
      }
    });
  }

  onHidden(){
    this.isModalShown= false;
  }

  isSelected(item){
    var boolean = this.selectedItems.value.find(element => element.label == item.label);
    return !!boolean;
  }

  onSelect(e){
    var item = this.allitems.find(element => element.name == e.value);
    let exist = false;
    this.selectedItems.value.forEach(element => {
      if (element.code == item.code) {
        exist = true;
      }
    });
    if (exist == false) {
      this.selectedItems.value.push({
        code: item.code,
        label: item.name,
        display: item.name,
        value: item.name,
      })
    }
    this.newItem.setValue('');
  }
}

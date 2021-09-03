import { Component, Input, EventEmitter, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-sheet-form-modal',
  templateUrl: './sheet-form-modal.component.html',
  styleUrls: ['./sheet-form-modal.component.css']
})
export class SheetFormModalComponent implements OnInit {

  smallnumPages: number ;
  sheetModalForm: FormGroup;
  title: string;
  items: any[];
  maxSize : number;
  itemsPerPage: number;
  selectedValues: any[];
  placeholder: string;
  public event: EventEmitter<any> = new EventEmitter();
  public eventPaginate: EventEmitter<any> = new EventEmitter();
  public addElementEvent: EventEmitter<any> = new EventEmitter();
  total: number;
  page: number;
  closeBtnName: string;
  @Input() selectedItems: FormControl;
  constructor(
    public bsModalRef: BsModalRef,
    private fb: FormBuilder
  ) { }
  public requestAutocompleteItems: any;
  get currentPage() { return this.sheetModalForm.get('currentPage') }
  ngOnInit() {
    this.selectedItems = new FormControl();
    this.selectedItems.setValue(this.selectedValues);
    this.sheetModalForm = this.createsheetModalForm();
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
  pageChanged(event: any): void {
    this.currentPage.setValue(event.page);
    this.eventPaginate.emit({ data: { page: this.currentPage.value } });
  }
}

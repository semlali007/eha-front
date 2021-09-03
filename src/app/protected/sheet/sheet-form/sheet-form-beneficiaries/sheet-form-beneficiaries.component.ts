
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';

import { BeneficiaryService } from 'src/app/core/services/beneficiary.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { SheetFormModalComponent } from '../sheet-form-modal/sheet-form-modal.component';
import { Beneficiary } from 'src/app/shared/models/beneficiary';

@Component({
  selector: 'app-sheet-form-beneficiaries',
  templateUrl: './sheet-form-beneficiaries.component.html',
  styleUrls: ['./sheet-form-beneficiaries.component.css']
})
export class SheetFormBeneficiariesComponent implements OnInit {

  @Input() beneficiaries: FormControl;
  @Input() sheetForm: FormGroup;
  private page: number;
  private items: Beneficiary[];
  private total: number;
  bsModalRef: BsModalRef;
  itemsPerPage: number;
  constructor(
    private fb: FormBuilder,
    private beneficiaryService: BeneficiaryService,
    private modalService: BsModalService
  ) {
  }

  ngOnInit() {
    this.page = 1;
    this.items = [];
    this.total = 0;
    this.itemsPerPage = 5;
  }

  public requestAutocompleteItems = (text: string): Observable<any> => {
    return this.beneficiaryService.requestAutocompleteItems(text);
  }

  openModalWithComponent() {
    
    this.beneficiaryService.getList({ page: this.page, perPage: this.itemsPerPage }).subscribe(data => {
      this.items = data.beneficiaries;
      this.total = data.total;
      let selected = [];
      if (!!this.beneficiaries.value) 
        {
          this.beneficiaries.value.forEach(element => {
            selected.push(element);
          });
        }

      const initialState = {
        items: this.items,
        total: this.total,
        title: 'Bénéficiaires',
        selectedValues: selected,
        itemsPerPage: this.itemsPerPage,
        placeholder: 'Entrer un bénéficiaire',
        maxSize: 6,
        requestAutocompleteItems: this.requestAutocompleteItems,
      };

      this.bsModalRef = this.modalService.show(SheetFormModalComponent, { initialState });
      this.bsModalRef.content.event.subscribe(res => {
        this.beneficiaries.setValue(res.data.value);
      });

      this.bsModalRef.content.addElementEvent.subscribe(res => {
        this.beneficiaryService.add(new Beneficiary({ label: res.data.value })).subscribe(t =>
          this.beneficiaryService.getList({ page: this.page, perPage: this.itemsPerPage }).subscribe(data => {
            this.bsModalRef.content.items = data.beneficiaries;
            this.bsModalRef.content.total = data.total;
          })
        );
      });

      this.bsModalRef.content.eventPaginate.subscribe(res => {
        this.beneficiaryService.getList({
          page: res.data.page,
          perPage: this.itemsPerPage
        }).subscribe(data => {
          this.bsModalRef.content.items = data.beneficiaries;
          this.bsModalRef.content.total = data.total;
        })
      });
    });
  }
}

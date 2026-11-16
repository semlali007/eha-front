
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';

import { DomainService } from 'src/app/core/services/domain.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { SheetFormModalComponent } from '../sheet-form-modal/sheet-form-modal.component';
import { EhaDomain } from 'src/app/shared/models/eha-domain';

@Component({
  selector: 'app-sheet-form-domain',
  templateUrl: './sheet-form-domain.component.html',
  styleUrls: ['./sheet-form-domain.component.css']
})
export class SheetFormDomainComponent implements OnInit {

  @Input() domains: FormControl;
  @Input() sheetForm: FormGroup;
  @Input() allDomains: [];
  private page: number;
  private items: EhaDomain[];
  private total: number;
  bsModalRef: BsModalRef;
  itemsPerPage: number;
  constructor(
    private fb: FormBuilder,
    private domainService: DomainService,
    private modalService: BsModalService
  ) {
  }

  ngOnInit() {
    this.page = 1;
    this.items = [];
    this.total = 0;
    this.itemsPerPage = 5;

    const savedDomains = localStorage.getItem('domains');
    if (savedDomains) {
      this.domains.setValue(JSON.parse(savedDomains));
    }

    this.domains.valueChanges.subscribe(value => {
      localStorage.setItem('domains', JSON.stringify(value));
    });
  }

  public requestAutocompleteItems = (text: string): Observable<any> => {
    return this.domainService.requestAutocompleteItems(text);
  }

  openModalWithComponent() {

    this.domainService.getList({ page: this.page, perPage: this.itemsPerPage }).subscribe(data => {
      this.items = data.domains;
      this.total = data.total;
      let selected = [];

      if (!!this.domains.value) 
        {
          this.domains.value.forEach(element => {
            selected.push(element);
          });
        }
      

      const initialState = {
        type:'domain',
        items: this.items,
        total: this.total,
        title: 'Segments',
        selectedValues: selected,
        itemsPerPage: this.itemsPerPage,
        placeholder: 'Entrer un segment',
        maxSize: 6,
        allitems: this.allDomains,
        requestAutocompleteItems: this.requestAutocompleteItems,
      };

      this.bsModalRef = this.modalService.show(SheetFormModalComponent, { initialState });
      this.bsModalRef.content.event.subscribe(res => {
        this.domains.setValue(res.data.value);
      });

      this.bsModalRef.content.addElementEvent.subscribe(res => {
        this.domainService.add(new EhaDomain({ label: res.data.value })).subscribe(t =>
          this.domainService.getList({ page: this.page, perPage: this.itemsPerPage }).subscribe(data => {
            this.bsModalRef.content.items = data.domains;
            this.bsModalRef.content.total = data.total;
          })
        );
      });

      this.bsModalRef.content.eventPaginate.subscribe(res => {
        this.domainService.getList({
          page: res.data.page,
          perPage: this.itemsPerPage,
          search: res.data?.search
        }).subscribe(data => {
          this.bsModalRef.content.items = data.domains;
          this.bsModalRef.content.total = data.total;
        })
      });
    });
  }
}

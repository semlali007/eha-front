
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';

import { SubdomainService } from 'src/app/core/services/subdomain.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { SheetFormModalComponent } from '../sheet-form-modal/sheet-form-modal.component';
import { EhaDomain } from 'src/app/shared/models/eha-domain';

@Component({
  selector: 'app-sheet-form-subdomain',
  templateUrl: './sheet-form-subdomain.component.html',
  styleUrls: ['./sheet-form-subdomain.component.css']
})
export class SheetFormSubdomainComponent implements OnInit {

  @Input() subdomains: FormControl;
  @Input() sheetForm: FormGroup;
  @Input() allSubdomains: [];
  private page: number;
  private items: EhaDomain[];
  private total: number;
  bsModalRef: BsModalRef;
  itemsPerPage: number;
  constructor(
    private fb: FormBuilder,
    private subdomainService: SubdomainService,
    private modalService: BsModalService
  ) {
  }

  ngOnInit() {
    this.page = 1;
    this.items = [];
    this.total = 0;
    this.itemsPerPage = 5;
    
    const savedSubdomains = localStorage.getItem('subdomains');
    if (savedSubdomains) {
      this.subdomains.setValue(JSON.parse(savedSubdomains));
    }

    this.subdomains.valueChanges.subscribe(value => {
      localStorage.setItem('subdomains', JSON.stringify(value));
    });
  }

  public requestAutocompleteItems = (text: string): Observable<any> => {
    return this.subdomainService.requestAutocompleteItems(text);
  }

  openModalWithComponent() {
    this.subdomainService.getList({ page: this.page, perPage: this.itemsPerPage }).subscribe(data => {
      this.items = data.subdomains;
      this.total = data.total;
      let selected = [];

      if (!!this.subdomains.value) 
        {
          this.subdomains.value.forEach(element => {
            selected.push(element);
          });
        }
      

      const initialState = {
        type:'subdomain',
        items: this.items,
        total: this.total,
        title: 'Segments',
        selectedValues: selected,
        itemsPerPage: this.itemsPerPage,
        placeholder: 'Entrer un segment',
        maxSize: 6,
        allitems: this.allSubdomains,
        requestAutocompleteItems: this.requestAutocompleteItems,
      };

      this.bsModalRef = this.modalService.show(SheetFormModalComponent, { initialState });
      this.bsModalRef.content.event.subscribe(res => {
        this.subdomains.setValue(res.data.value);
      });

      this.bsModalRef.content.addElementEvent.subscribe(res => {
        this.subdomainService.add(new EhaDomain({ label: res.data.value })).subscribe(t =>
          this.subdomainService.getList({ page: this.page, perPage: this.itemsPerPage }).subscribe(data => {
            this.bsModalRef.content.items = data.subdomains;
            this.bsModalRef.content.total = data.total;
          })
        );
      });

      this.bsModalRef.content.eventPaginate.subscribe(res => {
        this.subdomainService.getList({
          page: res.data.page,
          perPage: this.itemsPerPage,
          search: res.data?.search
        }).subscribe(data => {
          this.bsModalRef.content.items = data.subdomains;
          this.bsModalRef.content.total = data.total;
        })
      });
    });
  }
}

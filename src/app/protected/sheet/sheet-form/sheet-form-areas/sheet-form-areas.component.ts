
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';

import { AreaService } from 'src/app/core/services/area.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { SheetFormModalComponent } from '../sheet-form-modal/sheet-form-modal.component';
import { Area } from 'src/app/shared/models/area';

@Component({
  selector: 'app-sheet-form-areas',
  templateUrl: './sheet-form-areas.component.html',
  styleUrls: ['./sheet-form-areas.component.css']
})
export class SheetFormAreasComponent implements OnInit {

  @Input() areas: FormControl;
  @Input() sheetForm: FormGroup;
  @Input() allareas: [];
  private page: number;
  private items: Area[];
  private total: number;
  bsModalRef: BsModalRef;
  itemsPerPage: number;
  constructor(
    private fb: FormBuilder,
    private areaService: AreaService,
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
    return this.areaService.requestAutocompleteItems(text);
  }

  openModalWithComponent() {
    
    this.areaService.getList({ page: this.page, perPage: this.itemsPerPage }).subscribe(data => {
      this.items = data.areas;
      this.total = data.total;
      let selected = [];

      if (!!this.areas.value) 
        {
          this.areas.value.forEach(element => {
            selected.push(element);
          });
        }
      

      const initialState = {
        type:'area',
        items: this.items,
        total: this.total,
        title: 'Zones',
        selectedValues: selected,
        itemsPerPage: this.itemsPerPage,
        placeholder: 'Entrer une zone',
        maxSize: 6,
        allitems: this.allareas,
        requestAutocompleteItems: this.requestAutocompleteItems,
      };

      this.bsModalRef = this.modalService.show(SheetFormModalComponent, { initialState });
      this.bsModalRef.content.event.subscribe(res => {
        this.areas.setValue(res.data.value);
      });

      this.bsModalRef.content.addElementEvent.subscribe(res => {
        this.areaService.add(new Area({ label: res.data.value })).subscribe(t =>
          this.areaService.getList({ page: this.page, perPage: this.itemsPerPage }).subscribe(data => {
            this.bsModalRef.content.items = data.areas;
            this.bsModalRef.content.total = data.total;
          })
        );
      });

      this.bsModalRef.content.eventPaginate.subscribe(res => {
        this.areaService.getList({
          page: res.data.page,
          perPage: this.itemsPerPage
        }).subscribe(data => {
          this.bsModalRef.content.items = data.areas;
          this.bsModalRef.content.total = data.total;
        })
      });
    });
  }
}

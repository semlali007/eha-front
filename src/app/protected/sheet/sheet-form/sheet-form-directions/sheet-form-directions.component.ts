
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';

import { DirectionService } from 'src/app/core/services/direction.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { SheetFormModalComponent } from '../sheet-form-modal/sheet-form-modal.component';
import { Direction } from 'src/app/shared/models/direction';

@Component({
  selector: 'app-sheet-form-directions',
  templateUrl: './sheet-form-directions.component.html',
  styleUrls: ['./sheet-form-directions.component.css']
})
export class SheetFormDirectionsComponent implements OnInit {

  @Input() directions: FormControl;
  @Input() sheetForm: FormGroup;
  @Input() alldirections: [];
  @Input() mode: 'create' | 'edit' = 'edit'; // Nouveau: mode passé par le parent
  private page: number;
  private items: Direction[];
  private total: number;
  bsModalRef: BsModalRef;
  itemsPerPage: number;
  constructor(
    private fb: FormBuilder,
    private directionService: DirectionService,
    private modalService: BsModalService
  ) {
  }

  ngOnInit() {
    this.page = 1;
    this.items = [];
    this.total = 0;
    this.itemsPerPage = 5;
    
    // Ne charger le localStorage QUE si on n'est PAS en mode création
    if (this.mode !== 'create') {
      const savedDirections = localStorage.getItem('directions');
      if (savedDirections) {
        this.directions.setValue(JSON.parse(savedDirections));
      }
    }

    // Sauvegarder les changements dans localStorage - mais pas en mode création
    this.directions.valueChanges.subscribe(value => {
      if (this.mode !== 'create') {
        localStorage.setItem('directions', JSON.stringify(value));
      }
    });
  }

  public requestAutocompleteItems = (text: string): Observable<any> => {
    return this.directionService.requestAutocompleteItems(text);
  }

  openModalWithComponent() {

    this.directionService.getList({ page: this.page, perPage: this.itemsPerPage }).subscribe(data => {
      this.items = data.directions;
      this.total = data.total;
      let selected = [];

      if (!!this.directions.value) 
        {
          this.directions.value.forEach(element => {
            selected.push(element);
          });
        }
      

      const initialState = {
        type:'direction',
        items: this.items,
        total: this.total,
        title: 'Directions opérationnelles',
        selectedValues: selected,
        itemsPerPage: this.itemsPerPage,
        placeholder: 'Entrer une direction',
        maxSize: 6,
        allitems: this.alldirections,
        requestAutocompleteItems: this.requestAutocompleteItems,
      };

      this.bsModalRef = this.modalService.show(SheetFormModalComponent, { initialState });
      this.bsModalRef.content.event.subscribe(res => {
        this.directions.setValue(res.data.value);
      });

      this.bsModalRef.content.addElementEvent.subscribe(res => {
        this.directionService.add(new Direction({ label: res.data.value })).subscribe(t =>
          this.directionService.getList({ page: this.page, perPage: this.itemsPerPage }).subscribe(data => {
            this.bsModalRef.content.items = data.directions;
            this.bsModalRef.content.total = data.total;
          })
        );
      });

      this.bsModalRef.content.eventPaginate.subscribe(res => {
        this.directionService.getList({
          page: res.data.page,
          perPage: this.itemsPerPage,
          search: res.data?.search
        }).subscribe(data => {
          this.bsModalRef.content.items = data.directions;
          this.bsModalRef.content.total = data.total;
        })
      });
    });
  }
}

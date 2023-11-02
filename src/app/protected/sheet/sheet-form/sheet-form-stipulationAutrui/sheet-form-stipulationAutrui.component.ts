import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';

import { StipulationService } from 'src/app/core/services/stipulation.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { SheetFormModalComponent } from '../sheet-form-modal/sheet-form-modal.component';
import { Stipulation } from 'src/app/shared/models/stipulation';

@Component({
  selector: 'app-sheet-form-stipulationAutrui',
  templateUrl: './sheet-form-stipulationAutrui.component.html',
  styleUrls: ['./sheet-form-stipulationAutrui.component.css']
})
export class SheetFormStipulationAutruiComponent implements OnInit {

  @Input() stipulationAutrui: FormControl;
  @Input() sheetForm: FormGroup;
  @Input() allstipulationAutrui: [];
  private page: number;
  private items: Stipulation[];
  private total: number;
  bsModalRef: BsModalRef;
  itemsPerPage: number;

  constructor(
    private fb: FormBuilder,
    private stipulationService: StipulationService,
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
    return this.stipulationService.requestAutocompleteItems(text);
  }

  openModalWithComponent() {
    
    this.stipulationService.getList({ page: this.page, perPage: this.itemsPerPage }).subscribe(data => {
      this.items = data.stipulationAutrui;
      this.total = data.total;
      let selected = [];
      if (!!this.stipulationAutrui.value) 
        {
          this.stipulationAutrui.value.forEach(element => {
            selected.push(element);
          });
        }

      const initialState = {
        type:'stipulation',
        items: this.items,
        total: this.total,
        title: 'Stipulation pour autrui',
        selectedValues: selected,
        itemsPerPage: this.itemsPerPage,
        placeholder: 'Entrer une stipulation',
        maxSize: 6,
        isModalShown:false,
        toRemoveId:'',
        modalMessage: 'Cette stipulation est liée à d\'autres fiches. Voulez-vous supprimer?',
        allitems: this.allstipulationAutrui,
        requestAutocompleteItems: this.requestAutocompleteItems,
      };

      this.bsModalRef = this.modalService.show(SheetFormModalComponent, { initialState });
      this.bsModalRef.content.event.subscribe(res => {
        this.stipulationAutrui.setValue(res.data.value);
      });

      this.bsModalRef.content.addElementEvent.subscribe(res => {
        this.stipulationService.add(new Stipulation({ label: res.data.value })).subscribe(t =>
          this.stipulationService.getList({ page: this.page, perPage: this.itemsPerPage }).subscribe(data => {
            this.bsModalRef.content.items = data.stipulationAutrui;
            this.bsModalRef.content.total = data.total;
            this.bsModalRef.content.addItemToList({
              code: t.element.id,
              label:  t.element.name,
              display:t.element.name,
              value: t.element.name,
            })
          })
        );
      });

      this.bsModalRef.content.eventPaginate.subscribe(res => {
        this.page = res.data.page;
        this.stipulationService.getList({
          page: res.data.page,
          perPage: this.itemsPerPage
        }).subscribe(data => {
          this.bsModalRef.content.items = data.stipulationAutrui;
          this.bsModalRef.content.total = data.total;
        })
      });

      this.bsModalRef.content.removeElementEvent.subscribe(res => {
        this.stipulationService.filter({ code: res.data.code }).subscribe(t => {
          if (t.sheets && t.sheets.length > 0) {
            this.bsModalRef.content.modalMessage = "Attention, cette stipulation est rattachée à une autre fiche marché. Cette action est irréversible et entrainera la suppression du bénéficiaire ou stipulation dans l'ensemble des fiches marchés auxquelles il est rattaché. Voulez-vous confirmer sa suppression ?";
          }else{
            this.bsModalRef.content.modalMessage = ' Voulez-vous confirmer la suppression ?';
          }
          this.bsModalRef.content.isModalShown = true;
          this.bsModalRef.content.toRemoveId = res.data.code;
        }
        );
      });

      this.bsModalRef.content.runRemoveElementEvent.subscribe(res => {
        this.stipulationService.remove({ code: res.data.id }).subscribe(t => {
          this.stipulationService.getList({
            page: this.page,
            perPage: this.itemsPerPage
          }).subscribe(data => {
            this.bsModalRef.content.items = data.stipulationAutrui;
            this.bsModalRef.content.total = data.total;
          })
          this.bsModalRef.content.removeItemFromList(res.data.id);
          this.removeItemFromList(res.data.id);
        }
        );
      });

    });
  }

  removeItemFromList(code): void {
    this.stipulationAutrui.value.forEach((element, index) => {
      if (element.code == code) {
        this.stipulationAutrui.value.splice(index, 1);
      }
    });
  }
}

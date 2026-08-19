
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
  @Input() allbeneficiaries: [];
  @Input() mode: 'create' | 'edit' = 'edit'; // Nouveau: mode passé par le parent
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
    
    // Ne charger le localStorage QUE si on n'est PAS en mode création
    if (this.mode !== 'create') {
      const savedBeneficiaries = localStorage.getItem('beneficiaries');
      if (savedBeneficiaries) {
        this.beneficiaries.setValue(JSON.parse(savedBeneficiaries));
      }
    }

    // Sauvegarder les changements dans localStorage - mais pas en mode création
    this.beneficiaries.valueChanges.subscribe(value => {
      if (this.mode !== 'create') {
        localStorage.setItem('beneficiaries', JSON.stringify(value));
      }
    });
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
        type:'beneficiary',
        items: this.items,
        total: this.total,
        title: 'Bénéficiaires',
        selectedValues: selected,
        itemsPerPage: this.itemsPerPage,
        placeholder: 'Entrer un bénéficiaire',
        maxSize: 6,
        isModalShown:false,
        toRemoveId:'',
        modalMessage: 'Ce bénificiaire est lié à des autres fiches.Voulez-vous le supprimer?',
        allitems: this.allbeneficiaries,
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
        this.beneficiaryService.getList({
          page: res.data.page,
          perPage: this.itemsPerPage,
          search: res.data?.search
        }).subscribe(data => {
          this.bsModalRef.content.items = data.beneficiaries;
          this.bsModalRef.content.total = data.total;
        })
      });

      this.bsModalRef.content.removeElementEvent.subscribe(res => {
        this.beneficiaryService.filter({ code: res.data.code }).subscribe(t => {
          if (t.sheets && t.sheets.length > 0) {
            this.bsModalRef.content.modalMessage = "Attention, ce bénéficiaire est rattaché à une autre fiche marché. Cette action est irréversible et entrainera la suppression du bénéficiaire dans l'ensemble des fiches marchés auxquelles il est rattaché. Voulez-vous confirmer sa suppression ?";
          }else{
            this.bsModalRef.content.modalMessage = ' Voulez-vous confirmer la suppression ?';
          }
          this.bsModalRef.content.isModalShown = true;
          this.bsModalRef.content.toRemoveId = res.data.code;
        }
        );
      });

      this.bsModalRef.content.runRemoveElementEvent.subscribe(res => {
        this.beneficiaryService.remove({ code: res.data.id }).subscribe(t => {
          this.beneficiaryService.getList({
            page: this.page,
            perPage: this.itemsPerPage
          }).subscribe(data => {
            this.bsModalRef.content.items = data.beneficiaries;
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
    this.beneficiaries.value.forEach((element, index) => {
      if (element.code == code) {
        this.beneficiaries.value.splice(index, 1);
      }
    });
  }
}

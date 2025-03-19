
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { ProviderService } from 'src/app/core/services/provider.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { SheetFormModalComponent } from '../sheet-form-modal/sheet-form-modal.component';
import { Provider } from 'src/app/shared/models/provider';
@Component({
  selector: 'app-sheet-form-providers',
  templateUrl: './sheet-form-providers.component.html',
  styleUrls: ['./sheet-form-providers.component.css']
})
export class SheetFormProvidersComponent implements OnInit {
  @Input() providers: FormControl;
  @Input() sheetForm: FormGroup;
  @Input() allproviders: [];
  private page: number;
  private items: Provider[];
  private total: number;
  bsModalRef: BsModalRef;
  itemsPerPage: number;
  constructor(
    private fb: FormBuilder,
    private providerService: ProviderService,
    private modalService: BsModalService
  ) {
  }

  ngOnInit() {
    this.page = 1;
    this.items = [];
    this.total = 0;
    this.itemsPerPage = 5;
    
    const savedProviders = localStorage.getItem('providers');
    if (savedProviders) {
      this.providers.setValue(JSON.parse(savedProviders));
    }

    this.providers.valueChanges.subscribe(value => {
      localStorage.setItem('providers', JSON.stringify(value));
    });
  }

  public requestAutocompleteItems = (text: string): Observable<any> => {
    return this.providerService.requestAutocompleteItems(text);
  }

  openModalWithComponent() {
    this.providerService.getProviders({ page: this.page , perPage: this.itemsPerPage}).subscribe(data => {
      this.items = data.providers;
      this.total = data.total;

      let selected = [];

      if (!!this.providers.value) {
        this.providers.value.forEach(element => {
          selected.push(element);
        });
      }

      const initialState = {
        type:'provider',
        items: this.items,
        total: this.total,
        title: 'Fournisseurs',
        selectedValues: selected,
        itemsPerPage: this.itemsPerPage,
        placeholder: 'Entrer un fournisseur',
        maxSize: 6,
        allitems: this.allproviders,
        requestAutocompleteItems: this.requestAutocompleteItems
      };

      this.bsModalRef = this.modalService.show(SheetFormModalComponent, { initialState });
      this.bsModalRef.content.event.subscribe(res => {
        this.providers.setValue(res.data.value);
      });

      this.bsModalRef.content.addElementEvent.subscribe(res => {
        this.providerService.add(new Provider({ label: res.data.value })).subscribe(t =>
          this.providerService.getProviders({ page: this.page, perPage: this.itemsPerPage }).subscribe(data => {
            this.bsModalRef.content.items = data.providers;
            this.bsModalRef.content.total = data.total;
            this.bsModalRef.content.addItemToList({
              code: t.element.provider_code,
              label:  t.element.provider_label,
              display:t.element.provider_label,
              value: t.element.provider_label,
            })
          })
        );
      });


      this.bsModalRef.content.eventPaginate.subscribe(res => {
        this.page = res.data.pag;
        this.providerService.getProviders({
          page: res.data.page,
          perPage: this.itemsPerPage
        }).subscribe(data => {
          this.bsModalRef.content.items = data.providers;
          this.bsModalRef.content.total = data.total;
        })
      });


      this.bsModalRef.content.removeElementEvent.subscribe(res => {
        this.providerService.filter({ code: res.data.code }).subscribe(t => {
          if (t.sheets && t.sheets.length > 0) {
            this.bsModalRef.content.modalMessage = "Attention, ce fournisseur est rattaché à une autre fiche marché. Cette action est irréversible et entrainera la suppression du fournisseur dans l'ensemble des fiches marchés auxquelles il est rattaché. Voulez-vous confirmer sa suppression ?";
          }else{
            this.bsModalRef.content.modalMessage = ' Voulez-vous confirmer la suppression ?';
          }
          this.bsModalRef.content.isModalShown = true;
          this.bsModalRef.content.toRemoveId = res.data.code;
        }
        );
      });

      this.bsModalRef.content.runRemoveElementEvent.subscribe(res => {
        this.providerService.remove({ code: res.data.id }).subscribe(t => {
          this.providerService.getProviders({
            page: this.page,
            perPage: this.itemsPerPage
          }).subscribe(data => {
            this.bsModalRef.content.items = data.providers;
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
    this.providers.value.forEach((element, index) => {
      if (element.code == code) {
        this.providers.value.splice(index, 1);
      }
    });
  }
}

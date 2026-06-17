
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { ProviderService } from 'src/app/core/services/provider.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ProviderModalComponent } from '../provider-modal/provider-modal.component';
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
  @Input() mode: 'create' | 'edit' = 'edit'; // Nouveau: mode passé par le parent
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
    
    // Ne charger le localStorage QUE si on n'est PAS en mode création
    if (this.mode !== 'create') {
      const savedProviders = localStorage.getItem('providers');
      if (savedProviders) {
        this.providers.setValue(JSON.parse(savedProviders));
      }
    }

    // Sauvegarder les changements dans localStorage - mais pas en mode création
    this.providers.valueChanges.subscribe(value => {
      if (this.mode !== 'create') {
        localStorage.setItem('providers', JSON.stringify(value));
      }
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
        items: this.items,
        total: this.total,
        title: 'Fournisseurs',
        selectedValues: selected,
        itemsPerPage: this.itemsPerPage,
        maxSize: 6,
        requestAutocompleteItems: this.requestAutocompleteItems
      };

      this.bsModalRef = this.modalService.show(ProviderModalComponent, { initialState });
      this.bsModalRef.content.event.subscribe(res => {
        this.providers.setValue(res.data.value);
      });

      this.bsModalRef.content.addElementEvent.subscribe(res => {
        const payload = res.data;
        this.providerService.add(new Provider({
          label: payload.label,
          siren: payload.siren,
          numeroTva: payload.numeroTva,
          codeNaf: payload.codeNaf,
        })).subscribe(t =>
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

      this.bsModalRef.content.editElementEvent.subscribe((res: any) => {
        const payload = res.data;
        this.providerService.update(new Provider({
          code: payload.code,
          label: payload.label,
          siren: payload.siren,
          numeroTva: payload.numeroTva,
          codeNaf: payload.codeNaf,
        })).subscribe(_ => {
          this.providerService.getProviders({ page: this.page, perPage: this.itemsPerPage }).subscribe((data: any) => {
            this.bsModalRef.content.items = data.providers;
            this.bsModalRef.content.total = data.total;
          });
          // Reflète le nouveau libellé sur le fournisseur s'il est déjà sélectionné dans la fiche.
          this.bsModalRef.content.updateItemInList(payload.code, payload.label);
        });
      });


      this.bsModalRef.content.eventPaginate.subscribe(res => {
        this.page = res.data.page;
        this.providerService.getProviders({
          page: res.data.page,
          perPage: this.itemsPerPage,
          search: res.data?.search
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

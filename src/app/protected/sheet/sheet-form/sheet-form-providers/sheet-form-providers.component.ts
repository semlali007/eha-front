
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
        placeholder: 'Entrer un fournisseur',
        maxSize: 6,
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
          })
        );
      });


      this.bsModalRef.content.eventPaginate.subscribe(res => {
        this.providerService.getProviders({
          page: res.data.page,
          perPage: this.itemsPerPage
        }).subscribe(data => {
          this.bsModalRef.content.items = data.providers;
          this.bsModalRef.content.total = data.total;
        })
      });
    });
  }
}

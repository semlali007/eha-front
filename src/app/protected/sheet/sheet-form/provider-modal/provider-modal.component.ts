import { Component, EventEmitter, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { BsModalRef, ModalDirective } from 'ngx-bootstrap/modal';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

/**
 * Modale dédiée aux fournisseurs (création / édition / recherche / sélection).
 * Volontairement séparée de SheetFormModalComponent (partagée par 6 autres types)
 * pour éviter toute régression.
 */
@Component({
  selector: 'app-provider-modal',
  templateUrl: './provider-modal.component.html',
  styleUrls: ['./provider-modal.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ProviderModalComponent implements OnInit, OnDestroy {
  @ViewChild('autoShownModal', { static: false }) autoShownModal?: ModalDirective;

  // Données injectées via initialState
  title: string;
  items: any[] = [];
  total: number;
  itemsPerPage: number;
  maxSize: number;
  selectedValues: any[];
  public requestAutocompleteItems: any;

  smallnumPages: number;
  selectedItems: FormControl;
  modalForm: FormGroup;
  private searchSub?: Subscription;

  // Confirmation de suppression (modale imbriquée)
  isModalShown: boolean;
  modalMessage = '';
  toRemoveId: string;

  // Formulaire fournisseur (création / édition)
  isProviderFormShown = false;
  providerFormMode: 'create' | 'edit' = 'create';
  providerFormModel: any = null;

  // Events remontés au parent (sheet-form-providers)
  public event: EventEmitter<any> = new EventEmitter();
  public eventPaginate: EventEmitter<any> = new EventEmitter();
  public addElementEvent: EventEmitter<any> = new EventEmitter();
  public editElementEvent: EventEmitter<any> = new EventEmitter();
  public removeElementEvent: EventEmitter<any> = new EventEmitter();
  public runRemoveElementEvent: EventEmitter<any> = new EventEmitter();

  constructor(public bsModalRef: BsModalRef, private fb: FormBuilder) {}

  get currentPage() { return this.modalForm.get('currentPage') as FormControl; }
  get search() { return this.modalForm.get('search') as FormControl; }
  get selectedCount(): number { return (this.selectedItems?.value || []).length; }

  ngOnInit(): void {
    this.selectedItems = new FormControl();
    this.selectedItems.setValue(this.selectedValues || []);
    this.modalForm = this.fb.group({
      currentPage: 1,
      search: [''],
    });

    // Recherche serveur "live" : on relance la recherche après une courte pause de frappe.
    this.searchSub = this.search.valueChanges
      .pipe(debounceTime(350), distinctUntilChanged())
      .subscribe(() => this.submitSearch());
  }

  ngOnDestroy(): void {
    this.searchSub?.unsubscribe();
  }

  /** Un fournisseur a-t-il au moins un identifiant INSEE renseigné ? */
  hasIdentity(item: any): boolean {
    return !!(item && (item.siren || item.numeroTva || item.codeNaf));
  }

  clearSearch(): void {
    // setValue déclenche valueChanges -> submitSearch (liste complète).
    this.search.setValue('');
  }

  validateModal(): void {
    this.event.emit({ data: this.selectedItems });
    this.bsModalRef.hide();
  }

  submitSearch(): void {
    this.currentPage.setValue(1);
    this.eventPaginate.emit({ data: { page: 1, search: this.search.value } });
  }

  pageChanged(event: any): void {
    this.currentPage.setValue(event.page);
    this.eventPaginate.emit({ data: { page: this.currentPage.value, search: this.search.value } });
  }

  isSelected(item: any): boolean {
    return !!(this.selectedItems.value || []).find((element: any) => element.code == item.code);
  }

  addItemToList($event: any): void {
    const selected = this.selectedItems.value || [];
    const exist = selected.some((element: any) => element.code == $event.code);
    if (!exist) {
      selected.push({
        code: $event.code,
        label: $event.label,
        display: $event.label,
        value: $event.label,
      });
      this.selectedItems.setValue([...selected]);
    }
  }

  removeItemFromList(code: any): void {
    const selected = (this.selectedItems.value || []).filter((element: any) => element.code != code);
    this.selectedItems.setValue(selected);
  }

  // Met à jour le libellé d'un fournisseur déjà sélectionné après édition.
  updateItemInList(code: any, label: string): void {
    const selected = this.selectedItems.value || [];
    selected.forEach((element: any) => {
      if (element.code == code) {
        element.label = label;
        element.display = label;
        element.value = label;
      }
    });
    this.selectedItems.setValue([...selected]);
  }

  remove($event: any): void {
    this.removeElementEvent.emit({ data: $event });
  }

  // --- Formulaire fournisseur (création / édition) ---
  openCreateProvider(): void {
    this.providerFormMode = 'create';
    this.providerFormModel = null;
    this.isProviderFormShown = true;
  }

  openEditProvider(item: any): void {
    this.providerFormMode = 'edit';
    this.providerFormModel = { ...item };
    this.isProviderFormShown = true;
  }

  onProviderFormSave(payload: any): void {
    if (this.providerFormMode === 'edit') {
      this.editElementEvent.emit({ data: payload });
    } else {
      this.addElementEvent.emit({ data: payload });
    }
    this.isProviderFormShown = false;
  }

  onProviderFormCancel(): void {
    this.isProviderFormShown = false;
  }

  // --- Confirmation de suppression ---
  confirm(): void {
    this.hideModal();
    this.runRemoveElementEvent.emit({ data: { id: this.toRemoveId } });
  }

  decline(): void {
    this.hideModal();
  }

  hideModal(): void {
    this.autoShownModal?.hide();
    this.isModalShown = false;
  }

  onHidden(): void {
    this.isModalShown = false;
  }
}

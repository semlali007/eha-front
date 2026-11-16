import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, TemplateRef, OnChanges } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import tinymce from 'tinymce';


@Component({
  selector: 'app-sheet-form-contracts-item',
  templateUrl: './sheet-form-contracts-item.component.html',
  styles: [
  ]
})
export class SheetFormContractsItemComponent implements OnInit, OnChanges {
  @Input() contract: FormGroup;
  
  @Input() index: number;
  @Input() actualState: boolean;
  
  @Input() isActive: boolean;
  // @Input() lotsListForContract: FormControl;
  @Input() lotsListForContract: string[];
  filteredLots: string[] = [];
  // Fournisseurs sélectionnés en partie 3 (options de la dropdown "Fournisseur")
  @Input() providersForContract: string[] = [];

  @Output() removedContract = new EventEmitter<number>();
  @Output() openClose = new EventEmitter<{index:number}>();

  modalRef: BsModalRef;

  constructor(private modalService: BsModalService) { }


  ngOnInit(): void {
    this.filteredLots = this.lotsListForContract || [];
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Mise à jour de la dropdown quand la liste des lots change
    // (ajout / suppression / renommage d'un lot dans la section "Lots")
    if (changes['lotsListForContract']) {
      this.filteredLots = this.lotsListForContract || [];
    }
  }

  /**
   * Renvoie la valeur courante du champ "lots" du contrat si elle n'existe
   * plus dans la liste actuelle (lot renommé ou supprimé). Permet d'afficher
   * l'option en mode "lot non trouvé" plutôt que de masquer silencieusement.
   */
  get currentLotIfMissing(): string | null {
    const value = this.contract.get('lots')?.value;
    if (!value || typeof value !== 'string') return null;
    if ((this.filteredLots || []).includes(value)) return null;
    return value;
  }

  get hasNoLots(): boolean {
    return !this.filteredLots || this.filteredLots.length === 0;
  }

  get hasNoProviders(): boolean {
    return !this.providersForContract || this.providersForContract.length === 0;
  }

  /**
   * Renvoie la valeur courante du champ "provider" si elle n'est plus dans la
   * sélection de la partie 3 (fournisseur retiré, valeur importée via Excel,
   * fiche existante). Permet de l'afficher en "hors sélection" sans la perdre.
   */
  get currentProviderIfMissing(): string | null {
    const value = this.contract.get('provider')?.value;
    if (!value || typeof value !== 'string') return null;
    if ((this.providersForContract || []).includes(value)) return null;
    return value;
  }

  private updateFormControlState(): void {
    // Méthode conservée pour compatibilité
    // L'état d'édition est maintenant géré via le template uniquement
  }

  changeState(index): void {
    this.openClose.emit({index:index});
  }

 
  confirmation(template: TemplateRef<any>) {
		this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
	}
	 
	confirm(): void {
    this.removedContract.emit(this.index);
		this.modalRef.hide();
	}
	
	decline(): void {
		this.modalRef.hide();
	}

  get code() { return this.contract.get('code'); }

  // Méthodes conservées au cas où vous voudriez réactiver la fonctionnalité de filtrage
  onLotInput(value: string) {
    // les suggestions (non utilisée actuellement)
    this.filteredLots = this.lotsListForContract.filter(lot =>
      lot.toLowerCase().includes(value.toLowerCase())
    );
  }

  selectLot(selectedLot: string) {
    // Méthode conservée pour compatibilité (non utilisée actuellement)
    this.contract.get('lots')?.setValue(selectedLot);
  }

}

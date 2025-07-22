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

  @Output() removedContract = new EventEmitter<number>();
  @Output() openClose = new EventEmitter<{index:number}>();

  modalRef: BsModalRef;

  constructor(private modalService: BsModalService) { }


  ngOnInit(): void {
    // Initialiser filteredLots avec tous les lots disponibles
    this.filteredLots = this.lotsListForContract || [];
   }

  ngOnChanges(changes: SimpleChanges): void {
    // Surveiller les changements de isActive pour la gestion de l'interface
    if (changes['isActive']) {
      // L'état d'édition est géré via les propriétés CSS et la logique du template
    }
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

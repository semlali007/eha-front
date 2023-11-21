import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import tinymce from 'tinymce';


@Component({
  selector: 'app-sheet-form-contracts-item',
  templateUrl: './sheet-form-contracts-item.component.html',
  styles: [
  ]
})
export class SheetFormContractsItemComponent implements OnInit {
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

    console.log("le tableLot dans les item", this.lotsListForContract);
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

  onLotInput(value: string) {
    // les suggestions
    this.filteredLots = this.lotsListForContract.filter(lot =>
      lot.toLowerCase().includes(value.toLowerCase())
    );
  }

  selectLot(selectedLot: string) {
    // Mise à jour du champ "lots" lors de la sélection 
    this.contract.get('lots')?.setValue(selectedLot);
    this.filteredLots = []; 
  }

}

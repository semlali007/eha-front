import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-sheet-form-contracts-item',
  templateUrl: './sheet-form-contracts-item.component.html',
  styles: [
  ]
})
export class SheetFormContractsItemComponent implements OnInit {
  @Input() contract: FormGroup;
  @Input() index: number;
  @Input() lotsListForContract: FormControl;
  @Output() removedContract = new EventEmitter<number>();

  modalRef: BsModalRef;

  constructor(private modalService: BsModalService) { }

  ngOnInit(): void {
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
}

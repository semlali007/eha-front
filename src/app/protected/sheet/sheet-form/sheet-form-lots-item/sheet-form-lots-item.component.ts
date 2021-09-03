import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-sheet-form-lots-item',
  templateUrl: './sheet-form-lots-item.component.html',
  styles: [
  ]
})
export class SheetFormLotsItemComponent implements OnInit {
  @Input() lot: FormGroup;
  @Input() index: number;
  @Output() removedLot = new EventEmitter<number>();

  modalRef: BsModalRef;

  constructor(private modalService: BsModalService) { }
  ngOnInit(): void {
  }

  confirmation(template: TemplateRef<any>) {
		this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
	}
	 
	confirm(): void {
    this.removedLot.emit(this.index);
		this.modalRef.hide();
	}
	
	decline(): void {
		this.modalRef.hide();
	}
}

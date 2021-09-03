import { Component, ElementRef, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';


@Component({
	selector: 'app-sheet-form-options-item',
	templateUrl: './sheet-form-options-item.component.html',
	styleUrls: ['./sheet-form-options-item.component.scss']
})
export class SheetFormOptionsItemComponent implements OnInit{

	@Input() option: FormGroup;
	@Input() index: number;
	@Input() isFirst: boolean;
	@Input() isLast: boolean;
	@ViewChild('template') template : ElementRef;
	@Output() startDate = new EventEmitter<any>();
	@Output() removedTask = new EventEmitter<number>();

	modalRef: BsModalRef;

	constructor(private modalService: BsModalService) {
	 }

	ngOnInit() {

	}

	confirmation(template: TemplateRef<any>) {
		this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
	}
	 
	confirm(): void {
		this.removedTask.emit(this.index);
		this.modalRef.hide();
	}
	
	decline(): void {
		this.modalRef.hide();
	}
	   
}

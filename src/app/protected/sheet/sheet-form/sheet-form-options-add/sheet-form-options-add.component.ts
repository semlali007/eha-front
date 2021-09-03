import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
	selector: 'app-sheet-form-options-add',
	templateUrl: './sheet-form-options-add.component.html',
	styles: []
})
export class SheetFormOptionsAddComponent implements OnInit {

	@Output() addedTask = new EventEmitter<void>();

	constructor() { }

	ngOnInit() {
	}

	addTask() {
		this.addedTask.emit();
	}
}

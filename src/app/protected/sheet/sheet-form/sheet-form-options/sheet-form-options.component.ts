import { Component, OnInit, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { customValidator } from '../../customValidator';

@Component({
	selector: 'app-sheet-form-options',
	templateUrl: './sheet-form-options.component.html',
	styles: []
})
export class SheetFormOptionsComponent implements OnInit {

	@Input() options: FormArray;
	@Input() sheetForm: FormGroup;

	constructor(private fb: FormBuilder) { 
	}

	ngOnInit() {
	}

	createTaskForm(): FormGroup {
		return this.fb.group({
			'id': [''],
			'startDate': ['', [
			  Validators.required,
			  Validators.required
			]],
			'endDate': ['', [
			  Validators.required
			]]	
		  },
		  { validators : customValidator });
	}
	
	onAddedTask() {
		const option = this.createTaskForm();
		this.options.push(option);
	}

	onRemovedTask(index: number) {
		this.options.removeAt(index);
	}

}

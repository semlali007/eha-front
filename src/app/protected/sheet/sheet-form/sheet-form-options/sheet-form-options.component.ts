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
		const savedoptions = localStorage.getItem('options');
		if (savedoptions) {
		  const parsedoptions = JSON.parse(savedoptions);
		  parsedoptions.forEach((option: any) => {
			const optionGroup = this.fb.group({
			  'id': [option.id],
			  'startDate': [new Date(option.startDate)],
			  'endDate': [new Date(option.endDate)],	
			});
			this.options.push(optionGroup);
		  });
		}
		this.options.valueChanges.subscribe(value => {
		  const stringifiedValue = value.map(option => {
			return {
			  id: option.id,
			  startDate: option.startDate.toISOString(),
			  endDate: option.endDate.toISOString()
			};
		  });
		  localStorage.setItem('options', JSON.stringify(stringifiedValue));
		});
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

import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { customValidator } from '../../customValidator';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-sheet-form-options',
	templateUrl: './sheet-form-options.component.html',
	styles: []
})
export class SheetFormOptionsComponent implements OnInit, OnDestroy {

	@Input() options: FormArray;
	@Input() sheetForm: FormGroup;
	private valueChangesSubscription: Subscription;

	constructor(private fb: FormBuilder) { }

	ngOnInit() {
		this.loadOptionsFromLocalStorage();
		this.subscribeToValueChanges();
	}

	ngOnDestroy() {
		this.unsubscribeFromValueChanges();
	}

	private loadOptionsFromLocalStorage(): void {
		const savedOptions = localStorage.getItem('options');
		if (savedOptions) {
			try {
				const parsedOptions = JSON.parse(savedOptions);
				parsedOptions.forEach((option: any) => {
					const optionGroup = this.fb.group({
						'id': [option.id],
						'startDate': [new Date(option.startDate)],
						'endDate': [new Date(option.endDate)],
					});
					this.options.push(optionGroup);
				});
			} catch (error) {
				console.error('Error parsing saved options from localStorage', error);
			}
		}
	}

	
	private subscribeToValueChanges(): void {
		let latestOptions: any[];

		this.valueChangesSubscription = this.options.valueChanges.subscribe(value => {

			if (value !== null && value !== undefined) {
				const stringifiedValue = value.map(option => ({
					id: option.id,
					startDate: option.startDate? new Date(option.startDate).toISOString() : '',
					endDate: option.endDate? new Date(option.endDate).toISOString() : '',
				}));

				latestOptions = stringifiedValue;
			}
			
		});

		if (latestOptions !== undefined) {
			localStorage.setItem('latestOptions', JSON.stringify(latestOptions));
		  }
	}

	private unsubscribeFromValueChanges(): void {
		if (this.valueChangesSubscription) {
			this.valueChangesSubscription.unsubscribe();
		}
	}

	createTaskForm(): FormGroup {
		return this.fb.group({
			'id': [''],
			'startDate': ['', Validators.required],
			'endDate': ['', Validators.required],
		}, { validators: customValidator });
	}

	onAddedTask(): void {
		const option = this.createTaskForm();
		this.options.push(option);
	}

	onRemovedTask(index: number): void {
		this.options.removeAt(index);
	}
}

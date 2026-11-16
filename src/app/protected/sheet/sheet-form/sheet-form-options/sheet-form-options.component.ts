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
	@Input() mode: 'create' | 'edit' = 'edit'; // Nouveau: mode passé par le parent
	private valueChangesSubscription: Subscription;

	constructor(private fb: FormBuilder) { }

	ngOnInit() {
		// Ne charger le localStorage QUE si :
		// 1. On n'est PAS en mode création ET
		// 2. Le FormArray des options est vide (pas de données existantes)
		if (this.mode !== 'create' && this.options.length === 0) {
			this.loadOptionsFromLocalStorage();
		}
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
		this.valueChangesSubscription = this.options.valueChanges.subscribe(value => {

			if (value !== null && value !== undefined) {
				const stringifiedValue = value.map(option => ({
					id: option.id,
					startDate: option.startDate? new Date(option.startDate).toISOString() : '',
					endDate: option.endDate? new Date(option.endDate).toISOString() : '',
				}));

				// Sauvegarder dans localStorage - mais pas en mode création
				if (this.mode !== 'create') {
					localStorage.setItem('latestOptions', JSON.stringify(stringifiedValue));
				}
			}
			
		});
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

import { FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";

export const customValidator: ValidatorFn = (fg: FormGroup) : ValidationErrors | null => {
	const start = fg.get('startDate');
	const end = fg.get('endDate');
	return start.value >= end.value ? { "customValidator":true } : null ;
};
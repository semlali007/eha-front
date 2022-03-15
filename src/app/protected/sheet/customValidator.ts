import { FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";

export const customValidator: ValidatorFn = (fg: FormGroup) : ValidationErrors | null => {
	const start = fg.get('startDate');
	const end = fg.get('endDate');

	if (start.value == null || end.value == null)
	{
		return null;
	}

	return start.value >= end.value ? { "customValidator":true } : null ;
};
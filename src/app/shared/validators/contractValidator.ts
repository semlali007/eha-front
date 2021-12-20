import { FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";

export const contractValidator: ValidatorFn = (fg: FormGroup) : ValidationErrors | null => {
	const code = fg.get('code');
	const rex = /^[C]{1}[a-zA-Z0-9]*$/g;
	return (code.value.length < 9 || code.value.length > 10 || !rex.test(code.value)) ? { "contractValidator":true } : null ;
};
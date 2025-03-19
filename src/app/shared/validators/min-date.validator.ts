import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
export function MinDateValidator(minDate: any): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

        if (!control.value || !minDate.value) {
            return null;
        }

        return minDate.value < control.value ? null : { "minDateNotValid": true };
    }
}
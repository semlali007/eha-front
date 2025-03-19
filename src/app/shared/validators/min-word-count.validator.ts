import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
export function MinWordCountValidator(max: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

        if(!control.value){
            return null;
        }
        const vArray = control.value.split(' ');
        let count = 0;
        vArray.forEach(v => {
            if (v.replace(/ /g, '').length > 0) {
                count++;
            }
        })

        return count < max ?
            { minWordsCount: true } : null;
    }
}
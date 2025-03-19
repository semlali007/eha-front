import { AbstractControl,  ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ContractService } from 'src/app/core/services/contract.service';


export function invalidContractCodeValidator(contractService: ContractService): AsyncValidatorFn {
	return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
		return contractService.isCodeTaken(control.value).pipe(map(
			(contract: any) => {
				return (!!contract && !!contract.contract_code && contract.contract_code == control.value) ?  null: { "invalidContractCode": true };
			}
		));
	};

}
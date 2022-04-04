import { NgModule } from '@angular/core';
import { CountWordPipe } from '../pipes/count-word.pipe';
import { FiltermultiPipe } from '../pipes/filtermulti.pipe';
import { FilterCodePipe } from '../pipes/filter-code.pipe';
import { FilterAllPropertyPipe } from '../pipes/filter-all-property.pipe';
import { CustomDatePipe } from '../pipes/custom-date.pipe';
import { BooleanToTextPipe } from '../pipes/boolean.to.text.pipe';
import { SafePipe } from '../pipes/safe.pipe';

@NgModule({
	declarations: [CountWordPipe, CustomDatePipe, FilterCodePipe, FilterAllPropertyPipe, FiltermultiPipe,BooleanToTextPipe, SafePipe],
	imports: [],
	exports: [CountWordPipe, CustomDatePipe, FilterCodePipe, FilterAllPropertyPipe, FiltermultiPipe,BooleanToTextPipe, SafePipe]
})
export class PipesModule {}
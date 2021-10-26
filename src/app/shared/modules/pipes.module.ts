import { NgModule } from '@angular/core';
import { CountWordPipe } from '../pipes/count-word.pipe';
import { FilterCodePipe } from '../pipes/filter-code.pipe';
import { FilterAllPropertyPipe } from '../pipes/filter-all-property.pipe';
import { BooleanToTextPipe } from '../pipes/boolean.to.text.pipe';
import { SafePipe } from '../pipes/safe.pipe';

@NgModule({
	declarations: [CountWordPipe, FilterCodePipe, FilterAllPropertyPipe, BooleanToTextPipe, SafePipe],
	imports: [],
	exports: [CountWordPipe, FilterCodePipe, FilterAllPropertyPipe, BooleanToTextPipe, SafePipe]
})
export class PipesModule {}
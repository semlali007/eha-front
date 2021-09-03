import { NgModule } from '@angular/core';
import { CountWordPipe } from '../pipes/count-word.pipe';
import { FilterCodePipe } from '../pipes/filter-code.pipe';
import { FilterAllPropertyPipe } from '../pipes/filter-all-property.pipe';
import { BooleanToTextPipe } from '../pipes/boolean.to.text.pipe';

@NgModule({
	declarations: [CountWordPipe, FilterCodePipe, FilterAllPropertyPipe, BooleanToTextPipe],
	imports: [],
	exports: [CountWordPipe, FilterCodePipe, FilterAllPropertyPipe, BooleanToTextPipe]
})
export class PipesModule {}
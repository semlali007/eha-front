import { NgModule } from '@angular/core';
import { CountWordPipe } from '../pipes/count-word.pipe';
import { FiltermultiPipe } from '../pipes/filtermulti.pipe';
import { FilterCodePipe } from '../pipes/filter-code.pipe';
import { FilterLabelPipe } from '../pipes/filter-label.pipe';
import { FilterAllPropertyPipe } from '../pipes/filter-all-property.pipe';
import { CustomDatePipe } from '../pipes/custom-date.pipe';
import { BooleanToTextPipe } from '../pipes/boolean.to.text.pipe';
import { StripHtmlPipe } from '../pipes/stripHtml.pipe';
import { SafePipe } from '../pipes/safe.pipe';
import { NewsCastCategoryColor } from '../pipes/newscast-category-color.pipe';
import { SheetStatusColorPipe } from '../pipes/sheet-status-color.pipe';

@NgModule({
	declarations: [CountWordPipe, CustomDatePipe, FilterCodePipe, FilterLabelPipe, FilterAllPropertyPipe, FiltermultiPipe,BooleanToTextPipe, SafePipe, StripHtmlPipe, NewsCastCategoryColor, SheetStatusColorPipe],
	imports: [],
	exports: [CountWordPipe, CustomDatePipe, FilterCodePipe, FilterLabelPipe, FilterAllPropertyPipe, FiltermultiPipe,BooleanToTextPipe, SafePipe, StripHtmlPipe, NewsCastCategoryColor, SheetStatusColorPipe]
})
export class PipesModule {}
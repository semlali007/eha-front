import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { SearchComponent } from './search/search.component';
import { SearchFormComponent } from './search-form/search-form.component';
import { SearchResultComponent } from './search-result/search-result.component';
import { SearchFormWordsComponent } from './search-form/search-form-words/search-form-words.component';
import { SearchFormLineComponent } from './search-form/search-form-line/search-form-line.component';
import { SearchFormSampleComponent } from './search-form/search-form-sample/search-form-sample.component';
import { SearchResultTendersComponent } from './search-result/search-result-tenders/search-result-tenders.component';
import { SearchResultContractComponent } from './search-result/search-result-contract/search-result-contract.component';
import { SearchResultDauphinComponent } from './search-result/search-result-dauphin/search-result-dauphin.component';
import { SearchResultProviderComponent } from './search-result/search-result-provider/search-result-provider.component';
import { SearchResultItemGenericComponent } from './search-result/search-result-item-generic/search-result-item-generic.component';
import { SearchResultAgenciesComponent } from './search-result/search-result-agencies/search-result-agencies.component';
import { ModalInfoComponent } from 'src/app/core/components/modal-info/modal-info.component';
import {SearchRoutingModule} from './search-routing.module';

@NgModule({
  declarations: [SearchComponent, SearchFormComponent, SearchResultComponent, SearchFormWordsComponent, SearchFormLineComponent, SearchFormSampleComponent, SearchResultTendersComponent, SearchResultContractComponent, SearchResultDauphinComponent, SearchResultProviderComponent, SearchResultItemGenericComponent, SearchResultAgenciesComponent, ModalInfoComponent],
  imports: [
    SharedModule,
    SearchRoutingModule
  ],
  exports: []
})
export class SearchModule { }

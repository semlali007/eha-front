import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'src/app/core/services/message.service';
import { SearchService } from 'src/app/core/services/search.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styles: [
  ]
})
export class SearchFormComponent implements OnInit, OnDestroy {
  searchForm: FormGroup;
  subscription: Subscription;
  result: any =[];
  @Output() loadedResults = new EventEmitter<any>();
  @Output() resetedSearchForm = new EventEmitter<any>();
  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private searchService: SearchService,
  ) { }

  ngOnInit(): void {
    this.createSearchForm();
    this.subscription = this.messageService.getMessage().subscribe((searchData) => {
      if (!!searchData.searchText && !!searchData.type && (searchData.type === 'all')) {
        this.words.setValue(searchData.searchText);
        this.submit();
      }
    });
  }

  get words() { return this.searchForm.get('words') }
  get line() { return this.searchForm.get('line') as any; }

  createSearchForm(): FormGroup {
    return this.searchForm = this.fb.group({
      'words': ['', [Validators.required]],
      'line': '',
    });
  }

  submit() {
    let params: any = { words: this.words.value };
    params.system = '';
    if (this.line.value.length > 0) {
      params.system = this.line.value;
    }

    this.searchService
      .search(params)
      .subscribe(
        result => {
          this.result = result;
          this.loadedResults.emit(result);
        }
      );
  }

  onrResetedSearchForm() {
    this.searchForm.reset();
    this.createSearchForm();  
    this.resetedSearchForm.emit();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
   }

   onrChangedSystemForm() {
    this.submit();
  }
}

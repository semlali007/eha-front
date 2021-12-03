import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'src/app/core/services/message.service';
import { SearchService } from 'src/app/core/services/search.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
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
  bsModalRef: BsModalRef;
  @Output() loadedResults = new EventEmitter<any>();
  @Output() resetedSearchForm = new EventEmitter<any>();
  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private searchService: SearchService,
    private modalService: BsModalService,
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
    if (this.line.value.length > 0) {
      params.system = this.line.value;
    }
    this.searchService
      .search(params)
      .subscribe(
        result => {
          console.log(result);
          this.loadedResults.emit(result);
        },
        error=>{
          const initialState = {
            error: error,
          };

      //    this.bsModalRef = this.modalService.show(ModalInfoComponent, { initialState });

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
}

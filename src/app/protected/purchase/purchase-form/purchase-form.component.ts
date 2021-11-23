import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'src/app/core/services/message.service';
import { SearchService } from 'src/app/core/services/search.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-purchase-form',
  templateUrl: './purchase-form.component.html',
  styles: [
  ]
})
export class PurchaseFormComponent implements OnInit, OnDestroy {
  searchForm: FormGroup;
  subscription: Subscription;

  @Output() loadedResults = new EventEmitter<any>();
  @Output() resetedSearchForm = new EventEmitter<any>();
  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private searchService: SearchService
  ) { }

  ngOnInit(): void {
    this.createSearchForm();
  }

  get words() { return this.searchForm.get('words') }

  createSearchForm(): FormGroup {
    return this.searchForm = this.fb.group({
      'words': ['', [Validators.required]],
    });
  }

  submit() {
    let params: any = { words: this.words.value };
    this.searchService
      .search(params)
      .subscribe(
        result => {
          this.loadedResults.emit(result);
        }
      )
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

import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'src/app/core/services/message.service';
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
  searchText: string;
  @Output() submittedForm = new EventEmitter<any>();
  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.createSearchForm();
    this.subscription = this.messageService.getMessage().subscribe((searchData) => {
      if (!!searchData && !!searchData.type && (searchData.type == 'purchase')) {
        this.words.setValue(searchData.searchText);
        this.submit();
      }
    });
  }

  get words() { return this.searchForm.get('words') }

  createSearchForm(): FormGroup {
    return this.searchForm = this.fb.group({
      'words': ['', [Validators.required]],
    });
  }

  submit() {
    let params: any = { words: this.words.value };
    this.submittedForm.emit(params);
  }
ngOnDestroy(): void {
  if(this.subscription)
  this.subscription.unsubscribe();
}


}

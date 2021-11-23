import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-purchase-form',
  templateUrl: './purchase-form.component.html',
  styles: [
  ]
})
export class PurchaseFormComponent implements OnInit {
  searchForm: FormGroup;

  @Output() submittedForm = new EventEmitter<any>();
  constructor(
    private fb: FormBuilder,
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
    this.submittedForm.emit(params);
  }
}

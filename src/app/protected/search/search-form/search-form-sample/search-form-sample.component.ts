import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-search-form-sample',
  templateUrl: './search-form-sample.component.html',
  styles: [
  ]
})
export class SearchFormSampleComponent implements OnInit {
  @Output() resetedSearchForm = new EventEmitter<void>();
  @Input() words: FormControl;
  reset:boolean = false;
  constructor() { }

  ngOnInit(): void {
   console.log(this.words.value);
  }

  clearSearchForm() {
    this.reset = true;
    this.resetedSearchForm.emit();
  }
}

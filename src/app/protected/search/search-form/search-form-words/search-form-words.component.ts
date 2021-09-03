import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-search-form-words',
  templateUrl: './search-form-words.component.html',
  styles: [
  ]
})
export class SearchFormWordsComponent implements OnInit {
  @Input() words: FormControl;
  constructor() { }

  ngOnInit(): void {
  }

}

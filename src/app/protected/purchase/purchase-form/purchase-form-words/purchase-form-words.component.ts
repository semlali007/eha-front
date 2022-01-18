import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-purchase-form-words',
  templateUrl: './purchase-form-words.component.html',
  styles: [
  ]
})
export class PurchaseFormWordsComponent implements OnInit {
  @Input() words: FormControl;
  constructor() { }

  ngOnInit(): void {
    console.log(this.words);
  }

}

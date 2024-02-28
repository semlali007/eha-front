import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-sheet-form-words',
  templateUrl: './sheet-form-words.component.html',
  styles: [
  ]
})
export class SheetFormWordsComponent implements OnInit {
  @Input() words: FormControl;
  constructor() { }
  ngOnInit(): void {
    const savedWords = localStorage.getItem('words');
    if (savedWords) {
      this.words.setValue(JSON.parse(savedWords));
    }

    this.words.valueChanges.subscribe(value => {
      localStorage.setItem('words', JSON.stringify(value));
    });
  }
}

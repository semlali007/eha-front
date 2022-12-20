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
  }
}

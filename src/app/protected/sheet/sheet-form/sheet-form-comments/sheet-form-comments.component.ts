import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-sheet-form-comments',
  templateUrl: './sheet-form-comments.component.html',
  styles: [
  ]
})
export class SheetFormCommentsComponent implements OnInit {
  @Input() comments: FormControl;
  constructor() { }
  ngOnInit(): void {
  }
}


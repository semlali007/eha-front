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
    const savedComments = localStorage.getItem('comments');
    if (savedComments) {
      this.comments.setValue(savedComments);
    }

    this.comments.valueChanges.subscribe(value => {
      localStorage.setItem('comments', value);
    });
  }
}


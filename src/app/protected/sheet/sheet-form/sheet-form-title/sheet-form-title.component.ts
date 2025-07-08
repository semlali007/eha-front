import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-sheet-form-title',
  templateUrl: './sheet-form-title.component.html',
  styleUrls: ['./sheet-form-title.component.css']
})
export class SheetFormTitleComponent implements OnInit {
  @Input() title: FormControl;
  constructor() { }
  ngOnInit(): void {
    const savedTitle = localStorage.getItem('title');
    if (savedTitle) {
      this.title.setValue(savedTitle);
    }

    this.title.valueChanges.subscribe(value => {
      localStorage.setItem('title', value);
    });
  }
}

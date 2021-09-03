import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-sheet-form-title',
  templateUrl: './sheet-form-title.component.html',
  styles: [
  ]
})
export class SheetFormTitleComponent implements OnInit {
  @Input() title: FormControl;
  constructor() { }
  ngOnInit(): void {
  }
}

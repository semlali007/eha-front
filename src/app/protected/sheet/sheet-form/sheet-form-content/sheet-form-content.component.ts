import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-sheet-form-content',
  templateUrl: './sheet-form-content.component.html',
  styles: [
  ]
})
export class SheetFormContentComponent implements OnInit {
  @Input() content: FormControl;
  constructor() { }
  ngOnInit(): void {
  }
}


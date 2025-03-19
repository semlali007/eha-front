import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-sheet-form-showcase',
  templateUrl: './sheet-form-showcase.component.html',
  styles: [
  ]
})
export class SheetFormShowcaseComponent implements OnInit {
  @Input() showcase: FormControl;
  constructor() { }

  ngOnInit(): void {
  }

}

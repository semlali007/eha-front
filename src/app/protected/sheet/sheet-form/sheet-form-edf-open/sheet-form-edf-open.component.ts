import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-sheet-form-edf-open',
  templateUrl: './sheet-form-edf-open.component.html',
  styles: [
  ]
})
export class SheetFormEdfOpenComponent implements OnInit {
  @Input() edf_open: FormControl;
  constructor() { }

  ngOnInit(): void {
  }

}

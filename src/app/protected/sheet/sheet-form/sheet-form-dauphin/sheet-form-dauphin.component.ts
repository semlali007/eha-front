import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-sheet-form-dauphin',
  templateUrl: './sheet-form-dauphin.component.html',
  styles: [
  ]
})
export class SheetFormDauphinComponent implements OnInit {
  @Input() dauphin: FormControl;
  constructor() { }

  ngOnInit(): void {
  }

}

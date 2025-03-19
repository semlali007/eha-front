import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-sheet-form-stipulation',
  templateUrl: './sheet-form-stipulation.component.html',
  styles: [
  ]
})
export class SheetFormStipulationComponent implements OnInit {
  @Input() stipulation_for_others: FormControl;
  constructor() { }

  ngOnInit(): void {
  }

}

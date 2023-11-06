import { Component, OnInit, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-sheet-form-lots',
  templateUrl: './sheet-form-lots.component.html',
  styles: [
  ]
})
export class SheetFormLotsComponent implements OnInit {
  @Input() lots: FormArray;
  @Input() sheetForm: FormGroup;
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
  }

  onAddedLot() {
    const lotGroup = this.fb.group({
      'name': '',
      'description': ''
    });
    this.lots.push(lotGroup);
  }

  onRemovedLot(index: number) {
    this.lots.removeAt(index);
  }
}

import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-sheet-form-partnership',
  templateUrl: './sheet-form-partnership.component.html',
  styles: [
  ]
})
export class SheetFormPartnershipComponent implements OnInit {
  @Input() partnership: FormControl;
  constructor() { }

  ngOnInit(): void {
    const savedValue = localStorage.getItem('partnership');
    if (savedValue) {
      this.partnership.setValue(savedValue === 'true');
    }

    this.partnership.valueChanges.subscribe(value => {
      localStorage.setItem('partnership', value.toString());
    });
  }
}

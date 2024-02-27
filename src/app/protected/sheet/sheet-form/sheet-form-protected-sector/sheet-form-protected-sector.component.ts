import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-sheet-form-protected-sector',
  templateUrl: './sheet-form-protected-sector.component.html',
  styles: [
  ]
})
export class SheetFormProtectedSectorComponent implements OnInit {
  @Input() protected_sector: FormControl;
  constructor() { }

  ngOnInit(): void {
    const savedValue = localStorage.getItem('protected_sector');
    if (savedValue) {
      this.protected_sector.setValue(savedValue === 'true');
    }

    this.protected_sector.valueChanges.subscribe(value => {
      localStorage.setItem('protected_sector', value.toString());
    });
  }
}

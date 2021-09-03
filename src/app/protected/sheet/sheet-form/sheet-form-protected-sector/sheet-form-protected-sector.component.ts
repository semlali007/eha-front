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
  }

}

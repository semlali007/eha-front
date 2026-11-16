import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-sheet-form-acheteur',
  templateUrl: './sheet-form-acheteur.component.html',
  styleUrls: ['./sheet-form-acheteur.component.css']
})
export class SheetFormAcheteurComponent {
  @Input() acheteur: FormControl;

  constructor() { }

}

import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-sheet-form-contract-manager',
  templateUrl: './sheet-form-contract-manager.component.html',
  styleUrls: ['./sheet-form-contract-manager.component.css']
})
export class SheetFormContractManagerComponent {
  @Input() control: FormControl;
}

import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-sheet-form-contracts-add',
  templateUrl: './sheet-form-contracts-add.component.html',
  styles: [
  ]
})
export class SheetFormContractsAddComponent implements OnInit {
  @Output() addedContract = new EventEmitter<void>();
  constructor() { }

  ngOnInit(): void {
  }

  addContract() {
    this.addedContract.emit();
  }
}

import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-sheet-form-lots-add',
  templateUrl: './sheet-form-lots-add.component.html',
  styles: [
  ]
})
export class SheetFormLotsAddComponent implements OnInit {

  @Output() addedLot = new EventEmitter<void>();
  constructor() { }

  ngOnInit(): void {
    
  }

  addLot() {
    this.addedLot.emit();
   }

}

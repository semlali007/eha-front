import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-sheet-list-search-form-text',
  templateUrl: './sheet-list-search-form-text.component.html',
  styles: [
  ]
})
export class SheetListSearchFormTextComponent implements OnInit {
  @Input() searchProvider: FormControl;
  @Input() searchText: FormControl;
  constructor() { }

  ngOnInit(): void {
  }

}

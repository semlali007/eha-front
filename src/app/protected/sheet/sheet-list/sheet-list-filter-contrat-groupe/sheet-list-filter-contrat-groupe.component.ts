import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-sheet-list-filter-contrat-groupe',
  templateUrl: './sheet-list-filter-contrat-groupe.component.html'
})
export class SheetListFilterContratGroupeComponent implements OnInit, OnChanges {

  @Input() contratGroupe: FormControl;
  @Output() changedFilter = new EventEmitter<Object>();
  @Input() list: any = [];
  isTotalCollapsed = false;

  constructor() { }

  ngOnInit(): void {
    // this.contratGroupe.setValue('all');
  }
  ngOnChanges(): void {
    if (this.contratGroupe && this.contratGroupe.value != 'all') {
      this.isTotalCollapsed = false;
    }
  }

  changeFilter(code: string): void {
    if (this.contratGroupe) {
      this.contratGroupe.setValue(code);
      this.changedFilter.emit({
        type: 'contratGroupe',
        value: code != 'all' ? code : ''
      });
    }
  }

  public isActive(code: string): boolean {
    return this.contratGroupe && this.contratGroupe.value == code;
  }

}

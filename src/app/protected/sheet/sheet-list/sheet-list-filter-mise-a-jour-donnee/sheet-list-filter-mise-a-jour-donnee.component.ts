import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-sheet-list-filter-mise-a-jour-donnee',
  templateUrl: './sheet-list-filter-mise-a-jour-donnee.component.html'
})
export class SheetListFilterMiseAJourDonneeComponent implements OnInit, OnChanges {
  @Input() miseAJourDonnee: FormControl;
  @Output() changedFilter = new EventEmitter<Object>();
  @Input() list: any = [];
  isTotalCollapsed = false;

  constructor() { }  ngOnInit(): void {
    // Ensure list is always an array
    if (!this.list) {
      this.list = [];
    }
  }
  
  ngOnChanges(): void {
    // Ensure list is always an array
    if (!this.list) {
      this.list = [];
    }
    
    if (this.miseAJourDonnee && this.miseAJourDonnee.value != 'all') {
      this.isTotalCollapsed = false;
    }
  }

  changeFilter(code: string): void {
    if (this.miseAJourDonnee) {
      this.miseAJourDonnee.setValue(code);
      this.changedFilter.emit({
        type: 'miseAJourDonnee',
        value: code != 'all' ? code : ''
      });
    }
  }

  public isActive(code: string): boolean {
    return this.miseAJourDonnee && this.miseAJourDonnee.value == code;
  }

}

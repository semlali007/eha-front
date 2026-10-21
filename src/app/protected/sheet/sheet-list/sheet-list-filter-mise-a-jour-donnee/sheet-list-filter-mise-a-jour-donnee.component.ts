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
  isTotalCollapsed = true;
  private initialized = false;

  constructor() { }

  ngOnInit(): void {
    if (!this.list) { this.list = []; }
  }

  ngOnChanges(): void {
    if (!this.list) { this.list = []; }
    if (!this.initialized && this.miseAJourDonnee && this.miseAJourDonnee.value != 'all') {
      this.isTotalCollapsed = false;
    }
    this.initialized = true;
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

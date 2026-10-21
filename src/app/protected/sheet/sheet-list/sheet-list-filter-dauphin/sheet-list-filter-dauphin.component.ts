import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'app-sheet-list-filter-dauphin',
  templateUrl: './sheet-list-filter-daupin.component.html',
  styles: [
  ]
})

export class SheetListFilterDauphinComponent implements OnInit, OnChanges {

  @Input() dauphin: any={};
  @Output() changedFilter = new EventEmitter<Object>();
  @Input() list: any = [];
  isTotalCollapsed = true;
  private initialized = false;

  constructor() { }

  ngOnInit(): void {}

  ngOnChanges(): void {
    if (!this.initialized && this.dauphin.value != 'all') {
      this.isTotalCollapsed = false;
    }
    this.initialized = true;
  }
  
  changeFilter(code) {
    this.dauphin.setValue(code);
    this.changedFilter.emit({
      type: 'dauphin',
      value: code != 'all' ? code : ''
    });
  }

  public isActive(code): boolean {
    return this.dauphin.value === code;
  }
}

import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'app-sheet-list-filter-partnership',
  templateUrl: './sheet-list-filter-partnership.component.html',
  styles: [
  ]
})

export class SheetListFilterPartnershipComponent implements OnInit,OnChanges {

  @Input() partnership: any={};
  @Output() changedFilter = new EventEmitter<Object>();
  @Input() list: any = [];
  isTotalCollapsed = true;
  private initialized = false;

  constructor() { }

  ngOnInit(): void {}

  ngOnChanges(): void {
    if (!this.initialized && this.partnership.value != 'all') {
      this.isTotalCollapsed = false;
    }
    this.initialized = true;
  }
  changeFilter(code) {
    this.partnership.setValue(code);
    this.changedFilter.emit({
      type: 'partnership',
      value: code != 'all' ? code : ''
    });
  }

  public isActive(code): boolean {
    return this.partnership.value === code;
  }
}

import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'app-sheet-list-filter-sector',
  templateUrl: './sheet-list-filter-sector.component.html',
  styles: [
  ]
})

export class SheetListFilterSectorComponent implements OnInit,OnChanges {

  @Input() sector: any={};
  @Output() changedFilter = new EventEmitter<Object>();
  @Input() list: any = [];
  isTotalCollapsed = true;
  constructor() { }

  ngOnInit(): void {
   // this.sector.setValue('all');
  }
  ngOnChanges(): void {
    if (this.sector.value != 'all') {
      this.isTotalCollapsed = false;
    }
  }

  changeFilter(code) {
    this.sector.setValue(code);
    this.changedFilter.emit({
      type: 'sector',
      value: code != 'all' ? code : ''
    });
  }

  public isActive(code): boolean {
    return this.sector.value == code;
  }
}

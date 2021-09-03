import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'app-sheet-list-filter-status',
  templateUrl: './sheet-list-filter-status.component.html',
  styles: [
  ]
})

export class SheetListFilterStatusComponent implements OnInit, OnChanges {

  @Input() status: any ={};
  @Output() changedFilter = new EventEmitter<Object>();
  @Input() list: any = [];
  isTotalCollapsed = false;
  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    if (this.status.value != 'all') {
      this.isTotalCollapsed = false;
    }
  }

  changeFilter(code) {
    this.status.setValue(code);
    this.changedFilter.emit({
      type: 'status',
      value: code != 'all' ? code : ''
    });
  }


  public isActive(code): boolean {
    return this.status.value == code;
  }
}

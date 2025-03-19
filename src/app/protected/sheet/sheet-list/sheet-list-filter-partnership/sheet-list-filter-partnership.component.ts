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
  isTotalCollapsed = false;
  constructor() { }

  ngOnInit(): void {
   // this.partnership.setValue('all');
  }

  ngOnChanges(): void {
    if (this.partnership.value != 'all') {
      this.isTotalCollapsed = false;
    }
  }
  changeFilter(code) {
    this.partnership.setValue(code);
    this.changedFilter.emit({
      type: 'partnership',
      value: code != 'all' ? code : ''
    });
  }

  public isActive(code): boolean {
    return this.partnership.value == code;
  }
}

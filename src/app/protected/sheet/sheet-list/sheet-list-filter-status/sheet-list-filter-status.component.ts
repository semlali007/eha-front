import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'app-sheet-list-filter-status',
  templateUrl: './sheet-list-filter-status.component.html',
  styles: [
  ]
})

export class SheetListFilterStatusComponent implements OnInit, OnChanges {

  @Input() status: any = [];
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

  changeFilter0(code) {
    this.status.setValue(code);
    this.changedFilter.emit({
      type: 'status',
      value: code != 'all' ? code : ''
    });
  }

  changeFilter(code) {
    if (code == 'all') {
      this.status.setValue([]);
    } else
      if (this.isActive(code) == true) {
        const index = this.status.value.indexOf(code);
        if (index !== -1) {
          this.status.value.splice(index, 1);
        }
      } else {
        this.status.value.push(code);
      }

    this.changedFilter.emit({
      type: 'status',
      value: this.status.value
    });
  }

  public isActive0(code): boolean {
    return this.status.value == code;
  }

  public isActive(code): boolean {
    return this.status.value.includes(code);
  }
}

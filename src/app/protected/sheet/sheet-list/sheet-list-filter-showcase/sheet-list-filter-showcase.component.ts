import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'app-sheet-list-filter-showcase',
  templateUrl: './sheet-list-filter-showcase.component.html',
  styles: [
  ]
})

export class SheetListFilterShowcaseComponent implements OnInit, OnChanges {

  @Input() showcase: any={};
  @Output() changedFilter = new EventEmitter<Object>();
  @Input() list: any = [];
  isTotalCollapsed = false;
  constructor() { }

  ngOnInit(): void {
    //this.showcase.setValue('all');
  }

  ngOnChanges(): void {
    if (this.showcase.value != 'all') {
      this.isTotalCollapsed = false;
    }
  }
  
  changeFilter(code) {
    this.showcase.setValue(code);
    this.changedFilter.emit({
      type: 'showcase',
      value: code != 'all' ? code : ''
    });
  }

  public isActive(code): boolean {
    return this.showcase.value == code;
  }
}

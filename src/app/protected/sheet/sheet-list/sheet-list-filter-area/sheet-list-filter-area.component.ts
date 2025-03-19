import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'app-sheet-list-filter-area',
  templateUrl: './sheet-list-filter-area.component.html',
  styles: [
  ]
})

export class SheetListFilterAreaComponent implements OnInit, OnChanges {

  @Input() areas: any = [];
  @Output() changedFilter = new EventEmitter<Object>();
  @Input() list: any = [];
  isCollapsed = true;
  isTotalCollapsed = false;
  textButton = "Afficher plus";
  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    if (this.areas.value.length > 0) {
      this.isTotalCollapsed = false;
    }
  }

  changeFilter(code) {
    if (code == 'all') {
      this.areas.setValue([]);
    } else
      if (this.isActive(code) == true) {
        const index = this.areas.value.indexOf(code);
        if (index !== -1) {
          this.areas.value.splice(index, 1);
        }
      } else {
        this.areas.value.push(code);
      }

    this.changedFilter.emit({
      type: 'areas',
      value: this.areas.value
    });
  }

  public isActive(code): boolean {
    return this.areas.value.includes(code);
  }

  public showMore() {
    this.textButton = (this.isCollapsed == false) ? "Afficher plus" : "Afficher moins";
    this.isCollapsed = !this.isCollapsed;
  }
}

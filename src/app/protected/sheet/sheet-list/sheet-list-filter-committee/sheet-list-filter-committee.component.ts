import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'app-sheet-list-filter-committee',
  templateUrl: './sheet-list-filter-committee.component.html',
  styles: [
  ]
})

export class SheetListFilterCommitteeComponent implements OnInit,OnChanges {

  @Input() committees: any = [];
  @Output() changedFilter = new EventEmitter<Object>();
  @Input() list: any = [];
  isTotalCollapsed = false;
  isCollapsed = true;
  textButton = "Afficher plus";
  private initialized = false;

  constructor() { }

  ngOnInit(): void {
    if (!this.committees.value || this.committees.value.length === 0) {
      this.committees.setValue([]);
    }
  }

  ngOnChanges(): void {
    if (!this.initialized && this.committees.value.length > 0) {
      this.isTotalCollapsed = false;
    }
    this.initialized = true;
  }
  changeFilter(code) {
    if (code == 'all') {
      this.committees.setValue([]);
    } else
      if (this.isActive(code) == true) {
        const index = this.committees.value.indexOf(code);
        if (index !== -1) {
          this.committees.value.splice(index, 1);
        }
      } else {
        this.committees.value.push(code);
      }

    this.changedFilter.emit({
      type: 'committees',
      value: this.committees.value
    });
  }

  public isActive(code): boolean {
    return this.committees.value.includes(code);
  }

  public showMore() {
    this.textButton = (this.isCollapsed == false) ? "Afficher plus" : "Afficher moins";
    this.isCollapsed = !this.isCollapsed;
  }
}

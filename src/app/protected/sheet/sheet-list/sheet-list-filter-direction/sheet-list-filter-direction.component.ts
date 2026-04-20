import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'app-sheet-list-filter-direction',
  templateUrl: './sheet-list-filter-direction.component.html',
  styleUrls: ['./sheet-list-filter-direction.component.css']
})

export class SheetListFilterDirectionComponent implements OnInit,OnChanges {

  @Input() directions: any = [];
  @Output() changedFilter = new EventEmitter<Object>();
  @Input() list: any = [];
  isTotalCollapsed = false;
  isCollapsed = true;
  textButton = "Afficher plus";
  private initialized = false;

  constructor() { }

  ngOnInit(): void {
    if (!this.directions.value || this.directions.value.length === 0) {
      this.directions.setValue([]);
    }
  }

  ngOnChanges(): void {
    if (!this.initialized && this.directions.value.length > 0) {
      this.isTotalCollapsed = false;
    }
    this.initialized = true;
  }
  changeFilter(code) {
    if (code == 'all') {
      this.directions.setValue([]);
    } else
      if (this.isActive(code) == true) {
        const index = this.directions.value.indexOf(code);
        if (index !== -1) {
          this.directions.value.splice(index, 1);
        }
      } else {
        this.directions.value.push(code);
      }

    this.changedFilter.emit({
      type: 'directions',
      value: this.directions.value
    });
  }

  public isActive(code): boolean {
    return this.directions.value.includes(code);
  }

  public showMore() {
    this.textButton = (this.isCollapsed == false) ? "Afficher plus" : "Afficher moins";
    this.isCollapsed = !this.isCollapsed;
  }
}

import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'app-sheet-list-filter-supplier-size',
  templateUrl: './sheet-list-filter-supplier-size.component.html'
})
export class SheetListFilterSupplierSizeComponent implements OnInit, OnChanges {
  @Input() supplierSize: any = [];
  @Output() changedFilter = new EventEmitter<Object>();
  @Input() list: any = [];
  isTotalCollapsed = true;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    if (this.supplierSize.value != 'all') {
      this.isTotalCollapsed = false;
    }
  }

  changeFilter(code) {
    if (code == 'all') {
      this.supplierSize.setValue([]);
    } else
      if (this.isActive(code) == true) {
        const index = this.supplierSize.value.indexOf(code);
        if (index !== -1) {
          this.supplierSize.value.splice(index, 1);
        }
      } else {
        this.supplierSize.value.push(code);
      }

    this.changedFilter.emit({
      type: 'supplierSize',
      value: this.supplierSize.value
    });
  }
  public isActive(code): boolean {
    return this.supplierSize.value.includes(code);
  }

  getBadgeClass(name: string): string {
    switch(name) {
      case 'PME':
        return 'badge-success';
      case 'ETI':
        return 'badge-warning';
      case 'GE':
        return 'badge-info';
      default:
        return 'badge-secondary';
    }
  }
}

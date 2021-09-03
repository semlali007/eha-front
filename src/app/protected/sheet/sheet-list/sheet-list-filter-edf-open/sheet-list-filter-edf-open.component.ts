import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormControl, } from '@angular/forms';

@Component({
  selector: 'app-sheet-list-filter-edf-open',
  templateUrl: './sheet-list-filter-edf-open.component.html',
  styles: [
  ]
})

export class SheetListFilterEdfOpenComponent implements OnInit,OnChanges {

  @Input() edfOpen: FormControl;
  @Output() changedFilter = new EventEmitter<Object>();
  @Input() list: any = [];
  isTotalCollapsed = false;
  constructor() { }

  ngOnInit(): void {
   // this.edfOpen.setValue('all');
  }

  ngOnChanges(): void {
    if (this.edfOpen.value != 'all') {
      this.isTotalCollapsed = false;
    }
  }
  changeFilter(code){
    this.edfOpen.setValue(code);
    this.changedFilter.emit({
      type:'edfOpen',
      value : code!='all'?code:''
    });
  }

  public isActive(code): boolean {
    return this.edfOpen.value == code;
  }
}

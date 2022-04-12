import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-sheet-list-filter-subscribe',
  templateUrl: './sheet-list-filter-subscribe.component.html',
})
export class SheetListFilterSubscribeComponent implements OnInit {

  @Input() subscribe: any = {};
  @Output() changedFilter = new EventEmitter<Object>();
  @Input() list: any = [];

  constructor() { }

  ngOnInit(): void {
  }

  changeFilter() {
    this.subscribe.setValue(!this.subscribe.value);
    this.emitValue();
  }

  emitValue(){
    this.changedFilter.emit({
      type: 'subscribe',
      value: this.subscribe.value
    });
  }

  isActive(): boolean {
    return this.subscribe.value;
  }
}



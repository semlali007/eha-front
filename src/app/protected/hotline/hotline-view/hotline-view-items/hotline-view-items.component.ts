import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-hotline-view-items',
  templateUrl: './hotline-view-items.component.html',
  styles: [
  ]
})
export class HotlineViewItemsComponent implements OnInit {
  @Input() item: any;
  constructor() { }

  ngOnInit(): void {
  }

}

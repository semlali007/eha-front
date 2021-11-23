import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-purchase-result-items',
  templateUrl: './purchase-result-items.component.html',
  styles: [
  ]
})
export class PurchaseResultItemsComponent implements OnInit {

  @Input() item: any;
  constructor() { }

  ngOnInit(): void {
  }

}

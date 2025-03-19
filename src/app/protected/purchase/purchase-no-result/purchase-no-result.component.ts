import { Component, OnInit, Input } from '@angular/core';
@Component({
  selector: 'app-purchase-no-result',
  templateUrl: './purchase-no-result.component.html',
  styleUrls: ['./purchase-no-result.component.css']
})
export class PurchaseNoResultComponent implements OnInit {
  @Input() purchases: any = [];
  @Input() params: any;

  constructor() {
  }
  ngOnInit() {
  }
}

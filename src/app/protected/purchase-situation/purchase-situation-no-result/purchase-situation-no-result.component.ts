import { Component, OnInit, Input } from '@angular/core';
@Component({
  selector: 'app-purchase-situation-no-result',
  templateUrl: './purchase-situation-no-result.component.html',
  styleUrls: ['./purchase-situation-no-result.component.css']
})
export class PurchaseSituationNoResultComponent implements OnInit {
  @Input() purchases: any = [];
  @Input() params: any;

  constructor() {
  }
  ngOnInit() {
  }
}

import { Component, OnInit, Input } from '@angular/core';
@Component({
  selector: 'app-purchase-situation-list-item-header',
  templateUrl: './purchase-situation-list-item-header.component.html',
  styleUrls: ['./purchase-situation-list-item-header.component.css']
})
export class PurchaseSituationListItemHeaderComponent implements OnInit {
  @Input() item: any;
  @Input() isOpened: boolean=false;
  @Input() slicedLabel: string= "";
  
  constructor() {
  }
  ngOnInit() {
  }
}

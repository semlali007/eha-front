import { Component, OnInit, Input } from '@angular/core';
@Component({
  selector: 'app-purchases-list-item-header',
  templateUrl: './purchases-list-item-header.component.html',
  styleUrls: ['./purchases-list-item-header.component.css']
})
export class PurchaseListItemHeaderComponent implements OnInit {
  @Input() item: any;
  @Input() isOpened: boolean=false;
  @Input() slicedLabel: string= "";
  
  constructor() {
  }
  ngOnInit() {
  }
}

import { Component, OnInit, Input } from '@angular/core';
@Component({
  selector: 'app-purchases-list-item-body',
  templateUrl: './purchases-list-item-body.component.html',
  styleUrls: ['./purchases-list-item-body.component.css']
})
export class PurchaseListItemBodyComponent implements OnInit {
  @Input() purchase: any;
  constructor() {
  }
  ngOnInit() {
  }
}
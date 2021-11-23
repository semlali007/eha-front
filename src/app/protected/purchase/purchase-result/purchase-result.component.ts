
import { Component, OnInit, Input } from '@angular/core';
@Component({
  selector: 'app-purchase-result',
  templateUrl: './purchase-result.component.html',
  styles: [
  ]
})
export class PurchaseResultComponent implements OnInit {
  @Input() results: any = [];
  @Input() reset: boolean ;

  constructor() { }

  ngOnInit() {
  }

}

import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-purchase-result',
  templateUrl: './purchase-result.component.html',
  styleUrls: ['./purchase-result.component.css']
})
export class PurchaseResultComponent implements OnInit {
  @Input() purchases$: Observable<any>;
  constructor() { }
  ngOnInit() {
  }
}

import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PurchaseService } from 'src/app/core/services/purchase.service';
@Component({
  selector: 'app-search',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css']
})
export class PurchaseComponent implements OnInit {
  purchases$: Observable<any>;
  constructor(
    private purchaseService: PurchaseService
  ) {
  }

  ngOnInit(): void {

  }

  onSubmittedForm(params: any) {
    this.loadData(params);
  }

  loadData(params: any) {
    this.purchases$ = this.purchaseService.search(params);
  }

}

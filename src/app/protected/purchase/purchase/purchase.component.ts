import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { PurchaseService } from 'src/app/core/services/purchase.service';
import { DateService } from 'src/app/core/services/date.service';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css']
})
export class PurchaseComponent implements OnInit, OnDestroy {
  purchases: any = [];
  filtredPurchases: any = [];
  itemsPerPage: number = 5;
  isOpen: boolean = false;
  currentPage:number = 1;
  params: any = { words: "", offset: 0 };
  private subscription: Subscription;

  constructor(
    private purchaseService: PurchaseService,
  ) {
  }

  ngOnInit(): void {
    this.loadData({ words: "", offset: 0 });
  }



  loadData(params: any) {
    this.subscription = this.purchaseService.search(params).subscribe(response => {
      this.purchases = [];
      let list = [];
      if (params.words) {
        let result = response.find(obj => {
          return obj.purchase_demand_id == params.words
        });
        if (result)
          list.push(result);
      } else {
        list = response;
      }
      list.forEach(p => {
        this.purchases.push(
          {
            last_status_date: p['last_status_date'],
            last_status_event: p['last_status_event'],
            purchase_created_date: p['purchase_created_date'],
            purchase_creator_name: p['purchase_creator_name'],
            purchase_demand_id: p['purchase_demand_id'],
            purchase_demand_label: p['purchase_demand_label'],
            purchase_validator_name: p['purchase_validator_name']
          }
        );
      });
      this.filtredPurchases = this.purchases;
    })
  }

  onSubmittedForm(params: any) {
    this.params = params;
    this.loadData(params);
  }

  onPurchasesChanged(e) {
    this.filtredPurchases = e.purchases;
    this.currentPage = 1;
  }

  onOpenCloseChanged(e) {
    this.isOpen = !!e.isOpen;
  }
  
  onItemsPerPageChanged(e) {
    this.itemsPerPage = e;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

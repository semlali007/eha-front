import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PurchaseService } from 'src/app/core/services/purchase.service';
import { DateService } from 'src/app/core/services/date.service';
@Component({
  selector: 'app-search',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css']
})
export class PurchaseComponent implements OnInit {
  purchases$: Observable<any>;
  purchases: any = [];
  params: any = { words: "", offset: 0 };

  constructor(
    private purchaseService: PurchaseService,
    private dateService: DateService,
  ) {
  }

  ngOnInit(): void {
    this.loadData({ words: "", offset: 0 });
  }

  onSubmittedForm(params: any) {
    this.params = params;
    this.loadData(params);
  }

  loadData(params: any) {
    this.purchaseService.search(params).subscribe(response => {
      this.purchases = [];
      let list = [];
      if (params.words) {
        let result = response.find(obj => {
          return obj.purchase_demand_id == params.words
        });
        if(result)
          list.push(result);
      } else {
        list = response;
      }


      list.forEach(p => {
        this.purchases.push(
          {
            last_status_date: this.dateService.getDate(p['last_status_date']),
            last_status_event: p['last_status_event'],
            purchase_created_date: this.dateService.getDate(p['purchase_created_date']),
            purchase_creator_name: p['purchase_creator_name'],
            purchase_demand_id: p['purchase_demand_id'],
            purchase_demand_label: p['purchase_demand_label'],
            purchase_validator_name: p['purchase_validator_name']
          }
        );
      });
      console.log(this.purchases);
    })
  }

}

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
  purchases: any = [];
  params:any  = {words:"",offset:0};

  constructor(
    private purchaseService: PurchaseService
  ) {
  }

  ngOnInit(): void {
    this.loadData({words:"",offset:0}) ;
  }

  onSubmittedForm(params: any) { 
    this.params = params ;
    this.loadData(params);
  }

  loadData(params: any) {
    this.purchaseService.search(params).subscribe(response=>
      {
        this.purchases = [];
        if(params.words){
          let result = response.find(obj => {
            return obj.purchase_demand_id == params.words
          });
          this.purchases.push(result);
        }else{
          this.purchases = response;
        }
      }) 
  }

}

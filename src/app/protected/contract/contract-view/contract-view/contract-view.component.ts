import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ContractService } from 'src/app/core/services/contract.service';
import { Location } from '@angular/common';

@Component({
  selector: 'contract-view',
  templateUrl: './contract-view.component.html',
  styles: [
  ]
})
export class ContractViewComponent implements OnInit {
  public contractCode: string = '';
  public contract: any = {};
  constructor(
    private contractService: ContractService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {
  }
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (!!params.code) {
        this.contractCode = params.code;
        
        this.loadContract();
      }
    });
  }

  back() {
		this.location.back();
	}

  loadContract() {
    console.log('loadContract');
    this.contractService.get({
      code: this.contractCode,
    }).subscribe(contract => {  
      if (!contract) return;
      //C93P8T0090
      this.contract = contract;
      if(!!contract && !!contract.error){
      
      this.contract.postes = [
        ...new Map(this.contract.postes?.map((item) => [item["contract_post_code"]+'_1'+item["contract_post_label"]+'_2'+item["item_code"]+'_3'+item["item_label"], item])).values(),
    ];
     this.contract.postes.sort((a,b)=> Number(a.contract_post_code) > Number(b.contract_post_code));

      }

         });
  }

  public showProvider(providerCode): void {
    this.router.navigate([`app/fournisseur/details/${providerCode}`]);
  }
  
  public showSheet(id){
    this.router.navigate([`app/fiches/details/${id}`]);
  }

}

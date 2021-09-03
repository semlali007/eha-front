import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ContractService } from 'src/app/core/services/contract.service';

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
    private router: Router
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

  loadContract() {
    this.contractService.get({
      code: this.contractCode,
    }).subscribe(contract => {
      console.log(contract);
      if (!contract) return;
      this.contract = contract;
    });
  }

  public showProvider(providerCode): void {
    this.router.navigate([`app/fournisseur/details/${providerCode}`]);
  }
  
  public showSheet(id){
    this.router.navigate([`app/fiches/details/${id}`]);
  }

}

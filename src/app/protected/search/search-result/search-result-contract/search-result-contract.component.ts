import { Component, OnInit, Input} from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-search-result-contract',
  templateUrl: './search-result-contract.component.html',
  styles: [
  ]
})
export class SearchResultContractComponent implements OnInit {
  @Input() item: any;
  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  
  public showContract(contract): void {
    this.router.navigate([`app/contrat/details/${contract.code}`]);
  }

}

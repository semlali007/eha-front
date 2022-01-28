import { Component, OnInit, Input} from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-search-result-agencies',
  templateUrl: './search-result-agencies.component.html',
  styles: [
  ]
})
export class SearchResultAgenciesComponent implements OnInit {
  @Input() item: any;
  @Input() updatedDate: any;
  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  
  public showContract(agency): void {
    this.router.navigate([`app/article/details/${agency.code}`]);
  }

}

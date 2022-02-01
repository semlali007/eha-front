import { Component, OnInit, Input} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-result-provider',
  templateUrl: './search-result-provider.component.html',
  styles: [
  ]
})
export class SearchResultProviderComponent implements OnInit {
  @Input() item: any;
  @Input() updatedDate: any;
  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  

  public showProvider(provider): void {
    this.router.navigate([`app/fournisseur/details/${provider.code}`]);
  }

}

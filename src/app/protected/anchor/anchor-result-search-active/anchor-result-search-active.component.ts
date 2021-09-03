import { Component, OnInit, Input } from '@angular/core';
import { Provider } from 'src/app/shared/models/provider';
import { Router } from '@angular/router';
@Component({
  selector: 'app-anchor-result-search-active',
  templateUrl: './anchor-result-search-active.component.html',
  styles: [
  ]
})
export class AnchorResultSearchActiveComponent implements OnInit {

  @Input() activeProviders: Provider[];
  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  public showProvider(providerCode): void {
    this.router.navigate([`app/fournisseur/details/${providerCode}`]);
  }
}

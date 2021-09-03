import { Component, OnInit, Input } from '@angular/core';
import { Provider } from 'src/app/shared/models/provider';

@Component({
  selector: 'app-anchor-result-search-not-active',
  templateUrl: './anchor-result-search-not-active.component.html',
  styles: [
  ]
})
export class AnchorResultSearchNotActiveComponent implements OnInit {
  @Input() notActiveProviders: Provider[];
  constructor() { }

  ngOnInit(): void {
  }

}

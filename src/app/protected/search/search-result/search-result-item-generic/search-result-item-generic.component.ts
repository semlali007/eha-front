import { Component, OnInit, Input} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-result-item-generic',
  templateUrl: './search-result-item-generic.component.html',
  styles: [
  ]
})
export class SearchResultItemGenericComponent implements OnInit {
  @Input() item: any;
  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  
  public showItem(item): void {
    this.router.navigate([`app/article/details/${item.code}`]);
  }
}

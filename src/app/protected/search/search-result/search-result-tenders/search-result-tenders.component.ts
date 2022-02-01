import { Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-search-result-tenders',
  templateUrl: './search-result-tenders.component.html',
  styles: [
  ]
})
export class SearchResultTendersComponent implements OnInit {
  
  @Input() item: any;
  @Input() updatedDate: any;
  constructor() { }

  ngOnInit(): void {
  }

}

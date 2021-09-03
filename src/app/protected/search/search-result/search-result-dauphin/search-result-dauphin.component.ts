import { Component, OnInit, Input} from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-search-result-dauphin',
  templateUrl: './search-result-dauphin.component.html',
  styles: [
  ]
})
export class SearchResultDauphinComponent implements OnInit {
  @Input() item: any;
  constructor(private router: Router) { }

  ngOnInit(): void {
  }


  showDauphin(dauphin){
      this.router.navigate([`app/dauphin/details/${dauphin.code}`]);
  }

}

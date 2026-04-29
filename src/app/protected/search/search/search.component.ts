import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class SearchComponent implements OnInit {
  searchText: string;
  reset: boolean = false;
  results:any = [];
  homePath = 'app/accueil';
  constructor(private router: Router,
  ) {
  }

  ngOnInit(): void {

  }

  search() {

  }

  onLoadedResults(results) {
    this.reset = false; 
    this.results = results;
  }

  onResetedSearchForm() {
    this.reset = true;
    this.results = [];
  }

  navigate(path:string){
    this.router.navigate([path]);
  }
}

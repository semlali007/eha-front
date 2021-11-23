import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-search',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css']
})
export class PurchaseComponent implements OnInit {
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

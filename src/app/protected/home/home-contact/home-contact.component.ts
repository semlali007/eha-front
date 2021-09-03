import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-contact',
  templateUrl: './home-contact.component.html',
})
export class HomeContactComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  navigate(url){
    this.router.navigate(
      [url]
    );
  }
}

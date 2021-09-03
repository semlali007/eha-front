import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home-documentation',
  templateUrl: './home-documentation.component.html',
  styleUrls: ['./home-documentation.component.css']
})
export class HomeDocumentationComponent implements OnInit {
  subscription: Subscription;
  constructor(
    private router: Router,
    
  ) { }

  ngOnInit(): void {
   }

  navigate(url) {
    this.router.navigate(
      [url]
    );
  }

}

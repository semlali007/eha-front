import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent implements OnInit {
  homePath = 'app/accueil'
  constructor(private router: Router) { }
  ngOnInit(): void {
  }
  public navigate(page: string): void {
    this.router.navigate([page]);
  }
}

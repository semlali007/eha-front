import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  check: any;
  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.check = this.route.snapshot.data.check;
  }

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hotline-change-informations',
  templateUrl: './hotline-change-informations.component.html',
  styles: [
  ]
})
export class HotlineChangeInformationsComponent implements OnInit {

  constructor(private router: Router,) { }

  ngOnInit(): void {
  }


  createHotline(){
    this.router.navigate(['app/hotline/create']);
  }

}

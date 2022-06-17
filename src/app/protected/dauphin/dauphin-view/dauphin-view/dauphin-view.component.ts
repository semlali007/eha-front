import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DauphinService } from 'src/app/core/services/dauphin.service';

@Component({
  selector: 'dauphin-view',
  templateUrl: './dauphin-view.component.html',
  styles: [
  ]
})
export class DauphinViewComponent implements OnInit {
  public code: string = '';
  public dauphin: any = {};
  constructor(
    private dauphinService: DauphinService,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }
  ngOnInit(): void {

    this.route.params.subscribe(params => {
      if (!!params.code) {
        this.code = params.code;
        this.loadElement();
      }
    });

  }

  loadElement() {
    this.dauphinService.get({
      code: this.code,
    }).subscribe(element => {
      if (!element) return;
      this.dauphin = element;
    });
  }

}

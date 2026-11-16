import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { DauphinService } from 'src/app/core/services/dauphin.service';

@Component({
  selector: 'dauphin-view',
  templateUrl: './dauphin-view.component.html',
  styleUrls: ['./dauphin-view.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class DauphinViewComponent implements OnInit {
  public code: string = '';
  public dauphin: any = {};

  constructor(
    private dauphinService: DauphinService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (!!params.code) {
        this.code = params.code;
        this.loadElement();
      }
    });
  }

  back() {
    this.location.back();
  }

  isContractActive(): boolean {
    const endDate = this.dauphin?.info?.contract_end_date;
    if (!endDate) return true;
    const end = new Date(endDate);
    if (isNaN(end.getTime())) return true;
    return end.getTime() >= new Date().setHours(0, 0, 0, 0);
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

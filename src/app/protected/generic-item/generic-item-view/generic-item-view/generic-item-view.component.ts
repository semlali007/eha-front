import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GenericItemService } from 'src/app/core/services/generic-item.service';

@Component({
  selector: 'generic-item-view',
  templateUrl: './generic-item-view.component.html',
  styleUrls: ['./generic-item-view.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class GenericItemViewComponent implements OnInit {
  public code: string = '';
  public item: any = {};

  constructor(
    private genericItemService: GenericItemService,
    private route: ActivatedRoute,
    private location: Location,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (!!params.code) {
        this.code = params.code;
        this.loadItem();
      }
    });
  }

  back() {
    this.location.back();
  }

  loadItem() {
    this.genericItemService.get({
      code: this.code,
    }).subscribe(item => {
      if (!item) return;
      this.item = item;
    });
  }
}

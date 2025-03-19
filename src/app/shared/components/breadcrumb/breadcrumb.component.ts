import { Component, OnChanges, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, Event } from '@angular/router';
import { filter, distinctUntilChanged, map } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
})
export class BreadcrumbComponent implements OnInit, OnChanges {
  public breadcrumbs: any[]

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.activatedRoute.data.subscribe(response => {
      this.breadcrumbs = response.breadcrumb;
    }
    );
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe(response => {
      this.breadcrumbs = response.breadcrumb;
    }
    );
  }
  ngOnChanges() {
    this.activatedRoute.data.subscribe(response => {
      this.breadcrumbs = response.breadcrumb;
    }
    );
  }
  navigate(link: string) {
    this.router.navigate(
      [link]
    );
  }
}

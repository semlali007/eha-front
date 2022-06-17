import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AgencyService } from 'src/app/core/services/agency.service';

@Component({
  selector: 'agency-view',
  templateUrl: './agency-view.component.html',
  styles: [
  ]
})
export class AgencyViewComponent implements OnInit {
  public agencyCode: string = '';
  public agency: any = {};
  constructor(
    private agencyService: AgencyService,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }
  ngOnInit(): void {

    this.route.params.subscribe(params => {
      if (!!params.code) {
        this.agencyCode = params.code;
        this.loadagency();
      }
    });

  }

  loadagency() {
    this.agencyService.get({
      code: this.agencyCode,
    }).subscribe(agency => {
      if (!agency) return;
      this.agency = agency;
    });
  }

}

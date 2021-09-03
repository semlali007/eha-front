import { Component, OnInit, OnDestroy } from '@angular/core';
import { LayoutService } from 'src/app/core/services/layout.service';
import { Observable, Subscription } from 'rxjs';
@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.css']
})
export class AdministrationComponent implements OnInit, OnDestroy {

  public isSidenavCollapsed: boolean;
	private subscription: Subscription;

	constructor(private layoutService: LayoutService) { }

	ngOnInit() {
		this.subscription = this.layoutService.isSidenavCollapsed$
			.subscribe(isSidenavCollapsed => this.isSidenavCollapsed = isSidenavCollapsed);
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

}

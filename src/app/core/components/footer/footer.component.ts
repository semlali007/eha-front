import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/shared/models/user';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit, OnDestroy {

  public subscription: Subscription;
	public user: User;
  constructor(
    private router: Router,
    private authService: AuthService
    ) { }

    ngOnInit() { 
      this.subscription = this.authService.user$.subscribe(user => this.user = user);
    }

  navigate(url){
    this.router.navigate(
      [url]
    );
  }

  ngOnDestroy() {
		this.subscription.unsubscribe();
	}

}

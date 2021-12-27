import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/shared/models/user';
import { AuthService } from 'src/app/core/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent implements OnInit {
  homePath = 'app/accueil'
  public user: User;
  private subscription: Subscription;
  constructor( private authService: AuthService,private router: Router) { }
  ngOnInit() {
    this.subscription = 
    this.authService.user$.subscribe(user =>{
     this.user = user;
 
    } );
   }

   ngOnDestroy() {
    this.subscription.unsubscribe();
   }

  public navigate(page: string): void {
    this.router.navigate([page]);
  }

  public logout() { this.authService.logout(); }

}

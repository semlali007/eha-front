import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/core/auth.service';
import { Subscription } from 'rxjs';
import { User } from 'src/app/shared/models/user';
import { Router } from '@angular/router';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {

  public user: User;
  private subscription: Subscription;
  
  constructor(
    private authService: AuthService,
    private router: Router
    ) { }
  
  ngOnInit() {
   this.subscription = 
   this.authService.user$.subscribe(user =>{
    this.user = user;

   } );
  }
  
  ngOnDestroy() {
   this.subscription.unsubscribe();
  }
  
  public logout() { this.authService.logout(); }
 /* public logout() {

    this.authService
      .logout()
      .subscribe(response=>{
          this.router.navigate(['/login'])
      }
      );

   }
   */
}

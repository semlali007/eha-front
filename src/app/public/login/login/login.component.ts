import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import {  ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit, OnDestroy, AfterViewInit {
  url:string='';
  sub: Subscription;
  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
  }
  ngOnInit(): void {
    this.sub = this.route.queryParams.subscribe(params => {
      if (!!params && !!params.url) {
        this.url = params.url.replace(/\//g,'w_t_p');
      }
  });

  }

  login() { 
    this.authService.login(this.url); 
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
   }

   ngAfterViewInit(){
    let userSubscription = this.authService.user$.subscribe(response=>
      {
        if(!!response && !!response.nni && response.nni.length>0){
          this.router.navigate(['app/accueil']) ;
        }
      }
      );
   }
}




import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import {  ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit, OnDestroy {
  url:string='';
  sub: Subscription;
  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
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
}




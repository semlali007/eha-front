import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  user$: Observable<any>;
  constructor(
    private authService: AuthService,
  ) {
  }

  ngOnInit(): void {
    this.authService.runInitialLoginSequence().then(() => {
      this.authService.autoLogin();
    });
    this.user$ = this.authService.user$;
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import {Browser} from 'src/app/core/services/browser.service' ;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(
    private authService: AuthService, private browser: Browser,
  ) {
  }

  ngOnInit(): void {
    this.browser.checkIfFirefox();
    this.authService.runInitialLoginSequence().then(() => {
      this.authService.autoLogin();
    })
  }
}

import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/core/services/users.service';
import { AuthService } from 'src/app/core/services/auth.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'achatpedia';
  constructor(private usersService: UsersService,
    private authService: AuthService) { }
  ngOnInit() {
    this.execAutoLogin();
  }

  private execAutoLogin() {

  }

}
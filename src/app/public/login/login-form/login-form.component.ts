import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { User } from 'src/app/shared/models/user';
import { DocumentationService } from 'src/app/core/services/documentation.service';
@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
})
export class LoginFormComponent implements OnInit {
  loginForm: FormGroup;
  user: User;
  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private authService: AuthService,
    private documentationService: DocumentationService,
    ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      'nni': ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20),
      ]],
      'password': ['', [
        Validators.minLength(2),
        Validators.required
      ]]
    });
  }

  get nni() { return this.loginForm.get('nni'); }
  get password() { return this.loginForm.get('password'); }

  submit(): void {
    
  }

}

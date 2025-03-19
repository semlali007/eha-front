import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AdministratorService } from 'src/app/core/services/administrator.service';

@Component({
  selector: 'app-administrator',
  templateUrl: './administrator.component.html',
  styleUrls: ['./administrator.component.css']
})
export class AdministratorComponent implements OnInit {
  administrators:any=[];
  administratorForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private administratorService: AdministratorService,
    ) { }

  get email() { return this.administratorForm.get('email') }
  ngOnInit(): void {
    this.administratorForm = this.fb.group({
      'email': ['', [
        Validators.required, Validators.email
      ]]
    });

    this.getList();
  }

  submit(): void {
   this.administratorService
   .add({email:this.email.value})
   .subscribe(response=>{
    this.getList();
   })
  }

  getList() {
    this.administrators =[];
    this.administratorService
      .getList({})
      .subscribe(response => {
        this.administrators = response.rows;
      })
  }

  delete(administrator) {
    this.administratorService
      .delete({ email: administrator.email })
      .subscribe(response => {
        this.getList();
      })
  }
}

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ExternalService } from 'src/app/core/services/external.service';

@Component({
  selector: 'app-external',
  templateUrl: './external.component.html',
  styleUrls: ['./external.component.css']
})
export class ExternalComponent implements OnInit {

  externals:any=[];
  externalForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private externalService: ExternalService,
    ) { }

  get adminEmail() { return this.externalForm.get('adminEmail') }
  get userEmail() { return this.externalForm.get('userEmail') }
  ngOnInit(): void {
    this.externalForm = this.fb.group({
      'userEmail': ['', [
        Validators.required, Validators.email
      ]],
      'adminEmail': ['', [
        Validators.required, Validators.email
      ]]
    });

    this.getList();
  }

  submit(): void {
   this.externalService
   .add({userEmail:this.userEmail.value, adminEmail:this.adminEmail.value})
   .subscribe(response=>{
    this.getList();
   })
  }

  getList() {
    this.externals =[];
    this.externalService
      .getList({})
      .subscribe(response => {
        this.externals = response.rows;
      })
  }

  delete(external) {
    this.externalService
      .delete({ email: external.externe_email })
      .subscribe(response => {
        this.getList();
      })
  }
}

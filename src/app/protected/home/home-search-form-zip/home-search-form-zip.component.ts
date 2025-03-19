import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'src/app/core/services/message.service';

@Component({
  selector: 'app-home-search-form-zip',
  templateUrl: './home-search-form-zip.component.html',
  styleUrls: ['./home-search-form-zip.component.css']
})
export class HomeSearchFormZipComponent implements OnInit {
  homeSearchFormZip: FormGroup;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,

  ) { }
  get zipCode() { return this.homeSearchFormZip.get('zipCode') }

  ngOnInit(): void {
    this.createSheetSearchForm();
  }

  createSheetSearchForm(): FormGroup {
    return this.homeSearchFormZip = this.fb.group({
      'zipCode': ['',[
        Validators.required,
      ]]
    });
  }

  submit(): void {
    let search = {
      type: 'zip_code',
      searchText: this.zipCode.value
    }
    
    this.messageService.sendMessage(search);
    this.router.navigate(
      ['app/ancrage/'+this.zipCode.value]
    );

  }
}

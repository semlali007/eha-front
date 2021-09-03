import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'src/app/core/services/message.service';

@Component({
  selector: 'app-home-search-form',
  templateUrl: './home-search-form.component.html',
  styleUrls: ['./home-search-form.component.css']
})
export class HomeSearchFormComponent implements OnInit {
  homeSearchForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private router:Router,
    private messageService: MessageService,

  ) { }
  get searchText() { return this.homeSearchForm.get('searchText') }

  ngOnInit(): void {
    this.createSheetSearchForm();
  }

  createSheetSearchForm(): FormGroup {
    return this.homeSearchForm = this.fb.group({
      'searchText': ['', [
        Validators.required,
      ]]
    });
  }

  submit(): void {
    let search = {
      type:'all',
      searchText: this.searchText.value
    }

    this.messageService.sendMessage(search);
    this.router.navigate(['/app/recherche']);
  }
}
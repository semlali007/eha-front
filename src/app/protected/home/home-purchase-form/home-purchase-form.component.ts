import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'src/app/core/services/message.service';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { PageService } from 'src/app/core/services/page.service';
import { ModalPageComponent } from 'src/app/core/components/modal-page/modal-page.component';

@Component({
  selector: 'app-home-purchase-form',
  templateUrl: './home-purchase-form.component.html',
  styleUrls: ['./home-purchase-form.component.css']
})
export class HomePurchaseFormComponent implements OnInit {
  homePurchaseForm: FormGroup;
  bsModalRef?: BsModalRef;
  page: any = {};
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private pageService: PageService,
    private modalService: BsModalService

  ) { }
  get searchText() { return this.homePurchaseForm.get('searchText') }

  ngOnInit(): void {
    this.createForm();
      this.loadPurchasePage();
    }
  
  
    loadPurchasePage() {
      this.pageService.getPage({ cache: 'cache' , page:'purchase_modal_news'}).subscribe(data => {
      this.page = data;
      })
    }
  

  createForm(): FormGroup {
    return this.homePurchaseForm = this.fb.group({
      'searchText': ['', [
				Validators.required,
				Validators.minLength(10),
				Validators.maxLength(10),
			  Validators.pattern('^[1]{1}[0-9]{9}$')
			]
    ]
    });
  }

  submit(): void {
    let search = {
      type: 'purchase',
      searchText: this.searchText.value
    }

    this.messageService.sendMessage(search);
    this.router.navigate(['/app/ma-situation-achat']);
  }

  openModalWithComponent() {
    const initialState = {
        title: 'test',
        list:[],
        page: this.page
    };
    this.bsModalRef = this.modalService.show(ModalPageComponent, {initialState});
    this.bsModalRef.content.closeBtnName = 'Close';
  }

  show() {
    let search = {
      type: 'purchase',
      searchText: ""
    }

    this.messageService.sendMessage(search);
    this.router.navigate(['/app/ma-situation-achat']);
  }
}
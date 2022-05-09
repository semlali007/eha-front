import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ActivatedRoute } from '@angular/router';
import { PageService } from 'src/app/core/services/page.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import html2canvas from 'html2canvas';


@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})
export class PageComponent implements OnInit {
  pageForm: FormGroup;
  pageCode: string = '';
  staticPage: any = null;
  constructor(private modalService: BsModalService,
    private route: ActivatedRoute,
    private pageService: PageService,
    private fb: FormBuilder,) { }

  ngOnInit(): void {
    this.pageForm = this.fb.group({
      'content': ['', [
        Validators.required
      ]],
      'active': false,
    });
    this.route.params.subscribe(params => {
      if (!!params.page) {
        this.pageCode = params.page;
        switch (params.page) {
          case 'sheet-modal-news':
            this.pageCode = 'sheet_modal_news';
            break;
          case 'purchase-modal-news':
            this.pageCode = 'purchase_modal_news'
            break;
          case 'welcome-text':
            this.pageCode = 'welcome-text'
            break;
        }
       this.loadData();
        console.log('page', this.pageCode);
      }
    });
  }
  get content() { return this.pageForm.get('content') }
  get active() { return this.pageForm.get('active') }
  loadData() {
    this.pageService.getPage({ page: this.pageCode }).subscribe(response => {
      this.staticPage = response;
      this.pageForm = this.fb.group({
        'content': [response.content, [
          Validators.required
        ]],
        'active': response.active,
      });
    })
  }

  submit(): void {
    this.pageService
    .update({page:this.pageCode, content:this.content.value, active: this.active.value})
    .subscribe(response=>{
     this.loadData();
    })
  }
}

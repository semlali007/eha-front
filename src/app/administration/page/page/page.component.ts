import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageService } from 'src/app/core/services/page.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: [
    '../../admin-shared.css',
    './page.component.css',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class PageComponent implements OnInit {
  public pageForm!: FormGroup;
  public pageCode: string = '';
  public staticPage: any = null;
  public saved = false;

  constructor(
    private route: ActivatedRoute,
    private pageService: PageService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.pageForm = this.fb.group({
      content: ['', [Validators.required]],
      active: [false],
    });
    this.route.params.subscribe(params => {
      if (!!params['page']) {
        switch (params['page']) {
          case 'sheet-modal-news':
            this.pageCode = 'sheet_modal_news';
            break;
          case 'purchase-modal-news':
            this.pageCode = 'purchase_modal_news';
            break;
          case 'welcome-text':
            this.pageCode = 'welcome-text';
            break;
          default:
            this.pageCode = params['page'];
        }
        this.loadData();
      }
    });
  }

  get content() { return this.pageForm.get('content'); }
  get active() { return this.pageForm.get('active'); }

  loadData(): void {
    this.pageService.getPage({ page: this.pageCode }).subscribe(response => {
      this.staticPage = response;
      this.pageForm = this.fb.group({
        content: [response.content, [Validators.required]],
        active: [!!response.active],
      });
    });
  }

  submit(): void {
    this.pageService.update({
      page: this.pageCode,
      content: this.content?.value,
      active: this.active?.value,
    }).subscribe(() => {
      this.saved = true;
      setTimeout(() => this.saved = false, 2500);
      this.loadData();
    });
  }
}

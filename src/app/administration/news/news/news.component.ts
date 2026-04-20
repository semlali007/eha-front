import { Component, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NewsService } from 'src/app/core/services/news.service';
import { PageService } from 'src/app/core/services/page.service';
import { NewsFormComponent } from 'src/app/administration/news/news-form/news-form.component';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: [
    '../../admin-shared.css',
    './news.component.css',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class NewsComponent implements OnInit {
  public news: any[] = [];
  public filtered: any[] = [];
  public searchText = '';
  public itemsPerPage = 10;
  public paginationForm!: FormGroup;

  public pageForm!: FormGroup;
  public type: string = '';
  public title: string = '';
  public staticPage: any = null;
  public saved = false;

  public bsModalRef?: BsModalRef;
  public bsConfirmModalRef?: BsModalRef;
  private idToDelete?: number;

  constructor(
    private modalService: BsModalService,
    private newsService: NewsService,
    private pageService: PageService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.paginationForm = this.fb.group({ currentPage: 1 });
    this.pageForm = this.fb.group({
      content: ['', [Validators.required]],
      active: [false],
    });
    this.route.params.subscribe(params => {
      if (!!params['type']) {
        switch (params['type']) {
          case 'home-page':
            this.type = 'home_page';
            this.title = 'Page d\'accueil';
            this.loadPage();
            break;
          case 'after-connexion':
            this.type = 'after_connexion';
            this.title = 'Première connexion';
            break;
        }
        this.loadData();
      }
    });
  }

  get currentPage() { return this.paginationForm.get('currentPage'); }
  get currentPageValue(): number { return this.currentPage?.value ?? 1; }
  get startIndex(): number { return (this.currentPageValue - 1) * this.itemsPerPage; }
  get endIndex(): number { return Math.min(this.startIndex + this.itemsPerPage, this.filtered.length); }
  get paged(): any[] { return this.filtered.slice(this.startIndex, this.endIndex); }
  get content() { return this.pageForm.get('content'); }
  get active() { return this.pageForm.get('active'); }

  loadData(): void {
    this.newsService.getList(this.type).subscribe((data: any) => {
      this.news = Array.isArray(data) ? data : [];
      this.applyFilter();
    });
  }

  loadPage(): void {
    this.pageService.getPage({ page: this.type }).subscribe(response => {
      this.staticPage = response;
      this.pageForm = this.fb.group({
        content: [response.content, [Validators.required]],
        active: [!!response.active],
      });
    });
  }

  onSearchChange(value: string): void {
    this.searchText = value;
    this.currentPage?.setValue(1);
    this.applyFilter();
  }

  private applyFilter(): void {
    const q = (this.searchText || '').trim().toLowerCase();
    this.filtered = !q
      ? [...this.news]
      : this.news.filter((n) => {
          return (n.title || '').toLowerCase().includes(q)
            || (n.description || '').toLowerCase().includes(q);
        });
  }

  pageChanged(event: any): void {
    this.currentPage?.setValue(event.page);
  }

  openAdd(id?: number): void {
    const initialState = { id, type: this.type };
    this.bsModalRef = this.modalService.show(NewsFormComponent, { initialState });
    this.bsModalRef.content.closeBtnName = 'Fermer';
    this.bsModalRef.content.afterAdd.subscribe(() => this.loadData());
  }

  openModal(template: TemplateRef<any>, id: number): void {
    this.bsConfirmModalRef = this.modalService.show(template, { class: 'modal-sm' });
    this.idToDelete = id;
  }

  confirm(): void {
    if (this.idToDelete == null) return;
    this.newsService.remove({ id: this.idToDelete }).subscribe(() => this.loadData());
    this.bsConfirmModalRef?.hide();
  }

  decline(): void {
    this.bsConfirmModalRef?.hide();
  }

  submit(): void {
    this.pageService.update({
      page: this.type,
      content: this.content?.value,
      active: this.active?.value,
    }).subscribe(() => {
      this.saved = true;
      setTimeout(() => this.saved = false, 2500);
      this.loadPage();
    });
  }
}

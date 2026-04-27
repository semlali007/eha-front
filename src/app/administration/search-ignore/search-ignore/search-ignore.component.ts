import { Component, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { SearchLogService } from 'src/app/core/services/search-log.service';
import { IgnoreFormComponent } from 'src/app/administration/search-ignore/ignore-form/ignore-form.component';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-search-ignore',
  templateUrl: './search-ignore.component.html',
  styleUrls: [
    './search-ignore.component.css',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class SearchIgnoreComponent implements OnInit {
  public words: any[] = [];
  public filtered: any[] = [];
  public searchText = '';
  public itemsPerPage = 10;
  public paginationForm!: FormGroup;

  public bsModalRef?: BsModalRef;
  public bsConfirmModalRef?: BsModalRef;
  private idToDelete?: number;

  constructor(
    private modalService: BsModalService,
    private searchLogService: SearchLogService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.paginationForm = this.fb.group({ currentPage: 1 });
    this.loadData();
  }

  get currentPage() { return this.paginationForm.get('currentPage'); }
  get currentPageValue(): number { return this.currentPage?.value ?? 1; }
  get startIndex(): number { return (this.currentPageValue - 1) * this.itemsPerPage; }
  get endIndex(): number { return Math.min(this.startIndex + this.itemsPerPage, this.filtered.length); }
  get pagedWords(): any[] { return this.filtered.slice(this.startIndex, this.endIndex); }

  loadData(): void {
    this.searchLogService.getIgnoreList({ type: 'home_page' }).subscribe((data) => {
      this.words = Array.isArray(data) ? data : [];
      this.applyFilter();
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
      ? [...this.words]
      : this.words.filter((w) => (w.word || '').toLowerCase().includes(q));
  }

  pageChanged(event: any): void {
    this.currentPage?.setValue(event.page);
  }

  openAdd(id?: number): void {
    const initialState = { id, type: 'home_page' };
    this.bsModalRef = this.modalService.show(IgnoreFormComponent, { initialState });
    this.bsModalRef.content.closeBtnName = 'Fermer';
    this.bsModalRef.content.afterAdd.subscribe(() => this.loadData());
  }

  openModal(template: TemplateRef<any>, id: number): void {
    this.bsConfirmModalRef = this.modalService.show(template, { class: 'modal-sm' });
    this.idToDelete = id;
  }

  confirm(): void {
    this.remove(this.idToDelete);
    this.bsConfirmModalRef?.hide();
  }

  decline(): void {
    this.bsConfirmModalRef?.hide();
  }

  private remove(id?: number): void {
    if (id == null) return;
    this.searchLogService.removeIgnored({ id }).subscribe(() => this.loadData());
  }
}

import { Component, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SearchLogService } from 'src/app/core/services/search-log.service';
import { AssociatedFormComponent } from 'src/app/administration/associated/associated-form/associated-form.component';
import { SynonymousFormComponent } from 'src/app/administration/associated/synonymous-form/synonymous-form.component';

@Component({
  selector: 'app-associated',
  templateUrl: './associated.component.html',
  styleUrls: [
    '../../admin-shared.css',
    './associated.component.css',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class AssociatedComponent implements OnInit {
  public entries: any[] = [];
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
  get pagedEntries(): any[] { return this.filtered.slice(this.startIndex, this.endIndex); }

  loadData(): void {
    this.searchLogService.getAssociatedList({ type: 'home_page' }).subscribe((data) => {
      this.entries = Array.isArray(data) ? data : [];
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
      ? [...this.entries]
      : this.entries.filter((e) => {
          if ((e.word || '').toLowerCase().includes(q)) return true;
          return (e.synonymous || []).some((s: any) => (s.synonymous || '').toLowerCase().includes(q));
        });
  }

  pageChanged(event: any): void {
    this.currentPage?.setValue(event.page);
  }

  openAdd(id?: number, title?: string): void {
    const initialState = { id, label: title, type: 'home_page' };
    this.bsModalRef = this.modalService.show(AssociatedFormComponent, { initialState });
    this.bsModalRef.content.closeBtnName = 'Fermer';
    this.bsModalRef.content.afterAdd.subscribe(() => this.loadData());
  }

  openAddSynonyous(id?: number): void {
    const initialState = { id, type: 'home_page' };
    this.bsModalRef = this.modalService.show(SynonymousFormComponent, { initialState });
    this.bsModalRef.content.closeBtnName = 'Fermer';
    this.bsModalRef.content.afterAdd.subscribe(() => this.loadData());
  }

  openModalRemoveSynonymous(template: TemplateRef<any>, id: number): void {
    this.bsConfirmModalRef = this.modalService.show(template, { class: 'modal-sm' });
    this.idToDelete = id;
  }

  openModalRemoveAssociated(template: TemplateRef<any>, id: number): void {
    this.bsConfirmModalRef = this.modalService.show(template, { class: 'modal-sm' });
    this.idToDelete = id;
  }

  confirm(): void {
    if (this.idToDelete == null) return;
    this.searchLogService.removeSynonymous({ id: this.idToDelete }).subscribe(() => this.loadData());
    this.bsConfirmModalRef?.hide();
  }

  confirmAssociated(): void {
    if (this.idToDelete == null) return;
    this.searchLogService.removeAssociated({ id: this.idToDelete }).subscribe(() => this.loadData());
    this.bsConfirmModalRef?.hide();
  }

  decline(): void {
    this.bsConfirmModalRef?.hide();
  }
}

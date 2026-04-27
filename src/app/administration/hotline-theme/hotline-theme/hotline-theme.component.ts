import { Component, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HotlineThemeService } from 'src/app/core/services/hotline-theme.service';
import { HotlineThemeFormComponent } from 'src/app/administration/hotline-theme/hotline-theme-form/hotline-theme-form.component';

@Component({
  selector: 'app-hotline-theme',
  templateUrl: './hotline-theme.component.html',
  styleUrls: [
    './hotline-theme.component.css',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class HotlineThemeComponent implements OnInit {
  public themes: any[] = [];
  public filtered: any[] = [];
  public searchText = '';
  public itemsPerPage = 10;
  public paginationForm!: FormGroup;

  public bsModalRef?: BsModalRef;
  public bsConfirmModalRef?: BsModalRef;
  private idToDelete?: number;

  constructor(
    private hotlineThemeService: HotlineThemeService,
    private modalService: BsModalService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.paginationForm = this.fb.group({ currentPage: 1 });
    this.getList();
  }

  get currentPage() { return this.paginationForm.get('currentPage'); }
  get currentPageValue(): number { return this.currentPage?.value ?? 1; }
  get startIndex(): number { return (this.currentPageValue - 1) * this.itemsPerPage; }
  get endIndex(): number { return Math.min(this.startIndex + this.itemsPerPage, this.filtered.length); }
  get paged(): any[] { return this.filtered.slice(this.startIndex, this.endIndex); }

  getList(): void {
    this.hotlineThemeService.getList({}).subscribe((response: any) => {
      this.themes = Array.isArray(response?.rows) ? response.rows : [];
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
      ? [...this.themes]
      : this.themes.filter((t) => (t.label || '').toLowerCase().includes(q));
  }

  pageChanged(event: any): void {
    this.currentPage?.setValue(event.page);
  }

  openAdd(id?: number): void {
    const initialState = { id };
    this.bsModalRef = this.modalService.show(HotlineThemeFormComponent, { initialState });
    this.bsModalRef.content.closeBtnName = 'Fermer';
    this.bsModalRef.content.afterAdd.subscribe(() => this.getList());
  }

  update(theme: any): void {
    this.hotlineThemeService.update({ id: theme.id }).subscribe(() => this.getList());
  }

  openModal(template: TemplateRef<any>, id: number): void {
    this.bsConfirmModalRef = this.modalService.show(template, { class: 'modal-sm' });
    this.idToDelete = id;
  }

  confirm(): void {
    if (this.idToDelete == null) return;
    this.hotlineThemeService.remove({ id: this.idToDelete }).subscribe(() => this.getList());
    this.bsConfirmModalRef?.hide();
  }

  decline(): void {
    this.bsConfirmModalRef?.hide();
  }
}

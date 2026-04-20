import { Component, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AdministratorService } from 'src/app/core/services/administrator.service';

@Component({
  selector: 'app-administrator',
  templateUrl: './administrator.component.html',
  styleUrls: [
    '../../admin-shared.css',
    './administrator.component.css',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class AdministratorComponent implements OnInit {
  public administrators: any[] = [];
  public filtered: any[] = [];
  public searchText = '';
  public itemsPerPage = 10;
  public administratorForm!: FormGroup;
  public paginationForm!: FormGroup;
  public added = false;

  public bsConfirmModalRef?: BsModalRef;
  public toDelete: any = null;

  constructor(
    private fb: FormBuilder,
    private administratorService: AdministratorService,
    private modalService: BsModalService,
  ) {}

  get email() { return this.administratorForm.get('email'); }
  get currentPage() { return this.paginationForm.get('currentPage'); }
  get currentPageValue(): number { return this.currentPage?.value ?? 1; }
  get startIndex(): number { return (this.currentPageValue - 1) * this.itemsPerPage; }
  get endIndex(): number { return Math.min(this.startIndex + this.itemsPerPage, this.filtered.length); }
  get paged(): any[] { return this.filtered.slice(this.startIndex, this.endIndex); }

  ngOnInit(): void {
    this.administratorForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
    this.paginationForm = this.fb.group({ currentPage: 1 });
    this.getList();
  }

  submit(): void {
    this.administratorService.add({ email: this.email?.value }).subscribe(() => {
      this.administratorForm.reset({ email: '' });
      this.added = true;
      setTimeout(() => this.added = false, 2500);
      this.getList();
    });
  }

  getList(): void {
    this.administratorService.getList({}).subscribe((response: any) => {
      this.administrators = Array.isArray(response?.rows) ? response.rows : [];
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
      ? [...this.administrators]
      : this.administrators.filter((a) => (a.email || '').toLowerCase().includes(q));
  }

  pageChanged(event: any): void {
    this.currentPage?.setValue(event.page);
  }

  openModal(template: TemplateRef<any>, admin: any): void {
    this.bsConfirmModalRef = this.modalService.show(template, { class: 'modal-sm' });
    this.toDelete = admin;
  }

  confirm(): void {
    if (!this.toDelete) return;
    this.administratorService.delete({ email: this.toDelete.email }).subscribe(() => this.getList());
    this.bsConfirmModalRef?.hide();
  }

  decline(): void {
    this.bsConfirmModalRef?.hide();
  }
}

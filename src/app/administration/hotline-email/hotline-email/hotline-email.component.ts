import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HotlineEmailService } from 'src/app/core/services/hotline-email.service';
import { HotlineEmailEditComponent } from '../hotline-email-edit/hotline-email-edit.component';
import { HotlineEmailFormComponent } from '../hotline-email-form/hotline-email-form.component';

@Component({
  selector: 'app-hotline-email',
  templateUrl: './hotline-email.component.html',
  styleUrls: [
    './hotline-email.component.css',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class HotlineEmailComponent implements OnInit {
  public emails: any[] = [];
  public filtered: any[] = [];
  public searchText = '';
  public itemsPerPage = 10;
  public paginationForm!: FormGroup;

  public bsModalRef?: BsModalRef;

  constructor(
    private hotlineEmailService: HotlineEmailService,
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
    this.hotlineEmailService.getList({}).subscribe((response: any) => {
      this.emails = Array.isArray(response?.rows) ? response.rows : [];
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
      ? [...this.emails]
      : this.emails.filter((e) => {
          return (e.email || '').toLowerCase().includes(q)
            || (e.groupe || '').toLowerCase().includes(q)
            || (e.category || '').toLowerCase().includes(q);
        });
  }

  pageChanged(event: any): void {
    this.currentPage?.setValue(event.page);
  }

  update(item: any): void {
    this.hotlineEmailService.update({ id: item.id }).subscribe(() => this.getList());
  }

  openEdit(email: any): void {
    const initialState = { id: email.id, actualEmail: email.email };
    this.bsModalRef = this.modalService.show(HotlineEmailEditComponent, { initialState });
    this.bsModalRef.content.closeBtnName = 'Fermer';
    this.bsModalRef.content.afterEdit.subscribe(() => this.getList());
  }

  openAdd(id?: number): void {
    const initialState = { id };
    this.bsModalRef = this.modalService.show(HotlineEmailFormComponent, { initialState });
    this.bsModalRef.content.closeBtnName = 'Fermer';
    this.bsModalRef.content.afterAdd.subscribe(() => this.getList());
  }
}

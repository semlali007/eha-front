import { Component, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HotlineGroupService } from 'src/app/core/services/hotline-group.service';
import { HotlineGroupFormComponent } from 'src/app/administration/hotline-group/hotline-group-form/hotline-group-form.component';

@Component({
  selector: 'app-hotline-group',
  templateUrl: './hotline-group.component.html',
  styleUrls: [
    './hotline-group.component.css',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class HotlineGroupComponent implements OnInit {
  public groups: any[] = [];
  public filtered: any[] = [];
  public searchText = '';
  public itemsPerPage = 10;
  public paginationForm!: FormGroup;

  public bsModalRef?: BsModalRef;
  public bsConfirmModalRef?: BsModalRef;
  private idToDelete?: string;

  constructor(
    private hotlineGroupService: HotlineGroupService,
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
    this.hotlineGroupService.getList({}).subscribe((response: any) => {
      this.groups = Array.isArray(response?.rows) ? response.rows : [];
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
      ? [...this.groups]
      : this.groups.filter((g) => (g.label || '').toLowerCase().includes(q));
  }

  pageChanged(event: any): void {
    this.currentPage?.setValue(event.page);
  }

  openAdd(id?: string): void {
    const initialState = { id };
    this.bsModalRef = this.modalService.show(HotlineGroupFormComponent, { initialState });
    this.bsModalRef.content.closeBtnName = 'Fermer';
    this.bsModalRef.content.afterAdd.subscribe(() => this.getList());
  }

  openModal(template: TemplateRef<any>, id: string): void {
    this.bsConfirmModalRef = this.modalService.show(template, { class: 'modal-sm' });
    this.idToDelete = id;
  }

  confirm(): void {
    if (this.idToDelete == null) return;
    this.hotlineGroupService.remove({ id: this.idToDelete }).subscribe(() => this.getList());
    this.bsConfirmModalRef?.hide();
  }

  decline(): void {
    this.bsConfirmModalRef?.hide();
  }
}

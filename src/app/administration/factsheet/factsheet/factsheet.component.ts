import { Component, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FactsheetService } from 'src/app/core/services/factsheet.service';
import { FactsheetFormComponent } from 'src/app/administration/factsheet/factsheet-form/factsheet-form.component';

@Component({
  selector: 'app-factsheet',
  templateUrl: './factsheet.component.html',
  styleUrls: [
    './factsheet.component.css',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class FactsheetComponent implements OnInit {
  public factsheets: any[] = [];
  public filtered: any[] = [];
  public searchText = '';
  public itemsPerPage = 10;
  public paginationForm!: FormGroup;

  public bsModalRef?: BsModalRef;
  public bsConfirmModalRef?: BsModalRef;
  private idToDelete?: number;

  constructor(
    private modalService: BsModalService,
    private factsheetService: FactsheetService,
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
  get paged(): any[] { return this.filtered.slice(this.startIndex, this.endIndex); }

  loadData(): void {
    this.factsheetService.getList({ type: 'home_page' }).subscribe((data: any) => {
      this.factsheets = Array.isArray(data) ? data : [];
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
      ? [...this.factsheets]
      : this.factsheets.filter((f) => (f.name || '').toLowerCase().includes(q));
  }

  pageChanged(event: any): void {
    this.currentPage?.setValue(event.page);
  }

  openAdd(id?: number): void {
    const initialState = { id, type: 'home_page' };
    this.bsModalRef = this.modalService.show(FactsheetFormComponent, { initialState });
    this.bsModalRef.content.closeBtnName = 'Fermer';
    this.bsModalRef.content.afterAdd.subscribe(() => this.loadData());
  }

  openModal(template: TemplateRef<any>, id: number): void {
    this.bsConfirmModalRef = this.modalService.show(template, { class: 'modal-sm' });
    this.idToDelete = id;
  }

  confirm(): void {
    if (this.idToDelete == null) return;
    this.factsheetService.remove({ id: this.idToDelete }).subscribe(() => this.loadData());
    this.bsConfirmModalRef?.hide();
  }

  decline(): void {
    this.bsConfirmModalRef?.hide();
  }
}

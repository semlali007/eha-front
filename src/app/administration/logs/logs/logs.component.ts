import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SearchLogService } from 'src/app/core/services/search-log.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: [
    './logs.component.css',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class LogsComponent implements OnInit {
  public logs: any[] = [];
  public filtered: any[] = [];
  public searchText = '';
  public itemsPerPage = 20;
  public paginationForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private searchLogService: SearchLogService,
  ) {}

  ngOnInit(): void {
    this.paginationForm = this.fb.group({ currentPage: 1 });
    this.loadData();
  }

  get currentPage() { return this.paginationForm.get('currentPage'); }
  get currentPageValue(): number { return this.currentPage?.value ?? 1; }

  get startIndex(): number { return (this.currentPageValue - 1) * this.itemsPerPage; }
  get endIndex(): number { return Math.min(this.startIndex + this.itemsPerPage, this.filtered.length); }

  get pagedLogs(): any[] {
    return this.filtered.slice(this.startIndex, this.endIndex);
  }

  loadData(): void {
    this.searchLogService.getLogsList({ type: 'home_page' }).subscribe((data) => {
      this.logs = Array.isArray(data) ? data : [];
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
      ? [...this.logs]
      : this.logs.filter((log) => (log.search_text || '').toLowerCase().includes(q));
  }

  pageChanged(event: any): void {
    this.currentPage?.setValue(event.page);
  }
}

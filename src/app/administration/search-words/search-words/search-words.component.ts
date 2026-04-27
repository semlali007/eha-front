import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SearchLogService } from 'src/app/core/services/search-log.service';

type SortKey = 'count' | 'word';

@Component({
  selector: 'app-search-words',
  templateUrl: './search-words.component.html',
  styleUrls: [
    './search-words.component.css',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class SearchWordsComponent implements OnInit {
  public words: any[] = [];
  public filtered: any[] = [];
  public searchText = '';
  public sortBy: SortKey = 'count';
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
  get pagedWords(): any[] { return this.filtered.slice(this.startIndex, this.endIndex); }

  get associatedCount(): number { return this.words.filter((w) => w.associated).length; }

  loadData(): void {
    this.searchLogService.getSearchedList({ type: 'home_page' }).subscribe((data) => {
      this.words = Array.isArray(data) ? data : [];
      this.applyFilter();
    });
  }

  onSearchChange(value: string): void {
    this.searchText = value;
    this.currentPage?.setValue(1);
    this.applyFilter();
  }

  setSort(key: SortKey): void {
    this.sortBy = key;
    this.currentPage?.setValue(1);
    this.applyFilter();
  }

  private applyFilter(): void {
    const q = (this.searchText || '').trim().toLowerCase();
    const base = !q
      ? [...this.words]
      : this.words.filter((w) => (w.word || '').toLowerCase().includes(q));

    this.filtered = base.sort((a, b) => {
      if (this.sortBy === 'count') {
        return (b.number ?? 0) - (a.number ?? 0);
      }
      return (a.word || '').localeCompare(b.word || '');
    });
  }

  pageChanged(event: any): void {
    this.currentPage?.setValue(event.page);
  }
}

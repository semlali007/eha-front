import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { User } from 'src/app/shared/models/user';
import { NewsCastService } from 'src/app/core/services/newscast.service';

@Component({
  selector: 'app-newscast-list',
  templateUrl: './newscast-list.component.html',
  styleUrls: [
    '../../admin-shared.css',
    './newscast-list.component.css',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class NewsCastListComponent implements OnInit, OnDestroy {
  public totalItems: number = 0;
  public itemsPerPage: number = 10;
  public paginationForm!: FormGroup;
  public searchText = '';
  public subscription!: Subscription;
  public user: User | null = null;
  public newsList: any[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private newsCastService: NewsCastService,
  ) {}

  ngOnInit() {
    this.subscription = this.authService.user$.subscribe(user => this.user = user);
    this.paginationForm = this.fb.group({ currentPage: 1 });
    this.loadItems();
  }

  get currentPage() { return this.paginationForm.get('currentPage'); }
  get currentPageValue(): number { return this.currentPage?.value ?? 1; }
  get totalPages(): number { return Math.ceil(this.totalItems / this.itemsPerPage); }

  get filtered(): any[] {
    const q = (this.searchText || '').trim().toLowerCase();
    if (!q) return this.newsList;
    return this.newsList.filter((n) =>
      (n.title || '').toLowerCase().includes(q)
      || (n.short_description || '').toLowerCase().includes(q)
      || (n.categ || '').toLowerCase().includes(q),
    );
  }

  onSearchChange(value: string): void {
    this.searchText = value;
  }

  public loadItems(): void {
    this.newsCastService.getList({ page: this.currentPageValue }).subscribe((data: any) => {
      this.totalItems = data?.total ?? 0;
      this.newsList = (data?.data || []).sort(
        (a: any, b: any) => new Date(b.created_date).getTime() - new Date(a.created_date).getTime(),
      );
    });
  }

  public navigateCreate(): void {
    this.router.navigate(['admin/actualites/creation']);
  }

  public openDetail(id: any): void {
    this.router.navigate([`admin/actualites/detail/${id}`]);
  }

  public pageChanged(event: any): void {
    this.currentPage?.setValue(event.page);
    this.loadItems();
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}

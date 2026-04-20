import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { User } from 'src/app/shared/models/user';
import { NewsCastService } from 'src/app/core/services/newscast.service';

@Component({
  selector: 'app-newscast-list-home',
  templateUrl: './newscast-list-home.component.html',
  styleUrls: [
    '../../admin-shared.css',
    './newscast-list-home.component.css',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class NewsCastListHomeComponent implements OnInit, OnDestroy {
  public pageForm!: FormGroup;
  public totalItems: number = 0;
  public subscription!: Subscription;
  public user: User | null = null;
  public newsList: any[] = [];
  public hasOrderChanges = false;
  public saved = false;

  private draggedIndex!: number;
  public draggedOverIndex!: number;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private newsCastService: NewsCastService,
  ) {}

  ngOnInit() {
    this.pageForm = this.fb.group({ active: false });
    this.subscription = this.authService.user$.subscribe(user => this.user = user);
    this.loadItems();
  }

  get active() { return this.pageForm.get('active'); }

  onSubmittedGetSheet(id: any): void {
    this.router.navigate([`admin/actualites/detail/${id}`]);
  }

  public loadItems(): void {
    this.newsCastService.getList({ is_home: 1 }).subscribe((data: any) => {
      this.totalItems = data?.total ?? 0;
      this.newsList = data?.data || [];
      this.active?.setValue(!!data?.active);
      this.hasOrderChanges = false;
    });
  }

  allowDrop(event: DragEvent, index: number): void {
    this.draggedOverIndex = index;
    event.preventDefault();
  }

  onDragStart(index: number): void {
    this.draggedIndex = index;
  }

  onDrop(event: DragEvent, index: number): void {
    event.preventDefault();
    const item = this.newsList[this.draggedIndex];
    this.newsList.splice(this.draggedIndex, 1);
    this.newsList.splice(index, 0, item);
    this.draggedIndex = -1;
    this.draggedOverIndex = -1;
    this.hasOrderChanges = true;
  }

  saveChange(): void {
    const sortedList: any[] = [];
    let position = 0;
    this.newsList.forEach(element => {
      position++;
      if (!!element) element.position = position;
      sortedList.push(element);
    });

    this.newsCastService.updatePositions({
      items: sortedList,
      active: this.active?.value,
    }).subscribe(() => {
      this.saved = true;
      setTimeout(() => this.saved = false, 2500);
      this.loadItems();
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}

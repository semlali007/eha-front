import { Component, OnInit, ViewEncapsulation, OnDestroy, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { PreviousService } from 'src/app/core/services/previous.service';
import { User } from 'src/app/shared/models/user';
import { NewsCastService } from 'src/app/core/services/newscast.service';


@Component({
  selector: 'app-newscast-list-home',
  templateUrl: './newscast-list-home.component.html',
  styleUrls: ['./newscast-list-home.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class NewsCastListHomeComponent implements OnInit, OnDestroy {
  totalItems: number = 0;
  itemsPerPage: number = 20;
  paginationForm: FormGroup;
  smallnumPages: number = 0;
  public subscription: Subscription;
  public user: User = null;
  newsList: any = [];
  private draggedIndex: number;
  public draggedOverIndex: number;


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private previousService: PreviousService,
    private newsCastService: NewsCastService,

  ) { }

  ngOnInit() {
    this.subscription = this.authService.user$.subscribe(user => this.user = user);
    this.paginationForm = this.fb.group({
      'currentPage': 1,
    });

    if (this.previousService.getPreviousUrl().includes('details')) {
      this.loadFilterFromStorage();
    } else {
    }
    this.loadItems();
  }

  get currentPage() { return this.paginationForm.get('currentPage') }

  public onsSubmittedSearchSheets(filter: any) {
    

  }

  btnClick = function () {
    this.router.navigate(['app/hotline/create'], { queryParams: { theme: 'sheet' } });
  };


  public onSubmittedFilterSheets(filter: any) {
    this.loadItems();
  }

  public onSubmittedGetSheet(id: any) {
    this.router.navigate([`app/fiches/details/${id}`]);
  }

  public onChangedSort(sort: any) {

  }

  public loadItems() {
    this.newsCastService.getList({is_home:1}).subscribe(
      data => {
        this.totalItems = data.total;
        this.newsList = data.data;
      }
    );

  }

  initFilterInput() {
  
  }

  initSortBy(sortBy, sortDirection) {
   
  }

  public navigate(page: string): void {
    if (page === 'fiche_marchee_list') {
      this.router.navigate(['app/fiches/liste']);
    }
    else if (page === 'creation') {
      this.router.navigate(['admin/actualites/creation']);
    }
  }

  public pageChanged(event: any): void {
   
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public loadFilterFromStorage() {
 
  }

  loadText() {
    
  }

  
  allowDrop($event, index): void {
    this.draggedOverIndex = index;
    $event.preventDefault();
  }

  onDragStart(index): void {
    this.draggedIndex = index;
  }

  onDrop($event, index): void {
    $event.preventDefault();
    const item = this.newsList[this.draggedIndex];
    this.newsList.splice(this.draggedIndex, 1);
    this.newsList.splice(index, 0, item);
    this.draggedIndex = -1;
    this.draggedOverIndex = -1;
  }
 
  saveChange(){
    let sortedList = [];
    let position: number = 0;
    this.newsList.forEach(element => {
      position++;
      if(!!element)
      element.position = position;
      sortedList.push(element);
    });

    this.newsCastService
    .updatePositions({items:sortedList})
    .subscribe(response=>{
      this.loadItems();
    });
  }

}

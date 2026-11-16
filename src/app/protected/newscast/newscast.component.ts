import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NewsCastService } from 'src/app/core/services/newscast.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-newscast',
  templateUrl: './newscast.component.html',
  styleUrls: ['./newscast.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class NewsCastComponent implements OnInit {
  id: number = 0;
  paginationForm!: FormGroup;
  newsCastFilterForm: FormGroup ;
  section: any = [];
  count = 0;
  category:any;
  itemsPerPage: number = 10;
  smallnumPages: number = 0;
  startItem: number = 0;
  parents: any = [];
  warning: string = '';
  description: string = '';
  items: any = [];
  categories: any = [];
  myNewsCast: any = null;
  constructor(
    private route: ActivatedRoute,
    private newsCastService: NewsCastService,
    private router: Router,
    private fb: FormBuilder,
  ) {
  }
  ngOnInit(): void {
    this.paginationForm = this.fb.group({
      'currentPage': 1,
    });
    this.loadNewsCast();
    this.newsCastFilterForm = this.fb.group({
      category: ['', [Validators.required]],
    });
    this.loadCategories();
  }
 
  get currentPage() { return this.paginationForm?.get('currentPage')}
  get totalPage() { return  Math.ceil(this.count/this.itemsPerPage)}
  loadNewsCast() {
    this.newsCastService.getFrontList({'category':this.category,'page': this.currentPage.value, 'perPage': this.itemsPerPage}).subscribe(data => {
      this.items = data;
      this.count = data.total;
    })
  }

  loadCategories() {
    this.newsCastService.getCategories().subscribe(data => {
      this.categories = data;
    })
  }

  changeCategory(e) {
    this.category = e.target.value;
    this.currentPage.setValue(1);
    this.loadNewsCast();
  }

  resetForm() {
    this.newsCastFilterForm.reset();
  }
  navigate(id, index){
    let previous = this.items.data[index-1]?.id;
    let next = this.items.data[index+1]?.id;
    this.router.navigate([`app/actualites/detail/${id}`]);
  }
  public pageChanged(event: any): void {
    this.currentPage.setValue(event.page);
     this.loadNewsCast();
  }

}


import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnInit, OnChanges {
  @Input() results: any = [];
  @Input() reset: boolean ;
  updatedDate:Date= new Date();

  private active = '';
  count = 0;
  itemsPerPage: number = 10;
  paginationForm: FormGroup;
  smallnumPages: number = 0;
  startItem: number = 0;
  endItem: number = 10;
  constructor(private fb: FormBuilder) { }

  get currentPage() { return this.paginationForm.get('currentPage') }

  ngOnInit() {
    this.updatedDate.setDate(this.updatedDate.getDate() - 1);
    this.paginationForm = this.fb.group({
      'currentPage': 1,
    });
  }
  ngOnChanges(): void {
    this.reloadData();
  }

  public navigate(page: any): void {
    this.active = page.code;
    this.results.elements.forEach(result => { 
      if(result.code == this.active)
        this.count = result.count;
    });
    this.currentPage.setValue(1);
  }
  public isActive(page: any): boolean {
    return page.code == this.active;
  }

  reloadData() {
    this.active = this.results.maxCount;
    this.count = this.results.countMax;
  }

  public pageChanged(event: any): void {
    this.startItem = (event.page - 1) * event.itemsPerPage;
    this.endItem = event.page * event.itemsPerPage;
    this.currentPage.setValue(event.page);
  }

  changePerPage(number: number) {
    this.itemsPerPage = number;
    this.currentPage.setValue(1);
    this.startItem = 0;
    this.endItem = this.itemsPerPage;
  }
}

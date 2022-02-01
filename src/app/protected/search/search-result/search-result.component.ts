
import { Component, OnInit, Input, OnChanges } from '@angular/core';
@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styles: [
  ]
})
export class SearchResultComponent implements OnInit, OnChanges {
  @Input() results: any = [];
  @Input() reset: boolean ;
  updatedDate:Date= new Date();

  private active = '';
  maxCount = 0;
  constructor() { }

  ngOnInit() {
    this.updatedDate.setDate(this.updatedDate.getDate() - 1);
  }
  ngOnChanges(): void {
    this.reloadData();
  }

  public navigate(page: any): void {
    this.active = page.code;
  }
  public isActive(page: any): boolean {
    return page.code == this.active;
  }

  reloadData() {
    console.log('this.data', this.results);
    this.active = this.results.maxCount;
  }
}

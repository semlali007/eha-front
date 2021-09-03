
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

  private active = '';
  maxCount = 0;
  constructor() { }

  ngOnInit() {
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

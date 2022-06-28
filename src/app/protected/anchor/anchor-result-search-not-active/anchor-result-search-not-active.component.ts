import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Provider } from 'src/app/shared/models/provider';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-anchor-result-search-not-active',
  templateUrl: './anchor-result-search-not-active.component.html',
  styleUrls: ['./anchor-result-search-not-active.component.css']
})
export class AnchorResultSearchNotActiveComponent implements OnInit, OnChanges {
  @Input() notActiveProviders: Provider[];
  paginationForm: FormGroup;
  @Input() itemsPerPage: number = 10;
  smallnumPages: number = 0;
  startItem: number = 0;
  endItem: number = 10;
  constructor(private fb: FormBuilder,) { }

  ngOnInit(): void {
    this.paginationForm = this.fb.group({
      'currentPage': [1],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes && !!changes.itemsPerPage) {
      this.currentPage.setValue(1);
      this.startItem = 0;
      this.endItem = this.itemsPerPage;
    }
    }
    
  get currentPage() { return this.paginationForm.get('currentPage') }
  get totalPage() { return  Math.ceil(this.notActiveProviders.length/this.itemsPerPage)}
  public pageChanged(event: any): void {
    this.startItem = (event.page - 1) * event.itemsPerPage;
    this.endItem = event.page * event.itemsPerPage;
    this.currentPage.setValue(event.page);
  }

}

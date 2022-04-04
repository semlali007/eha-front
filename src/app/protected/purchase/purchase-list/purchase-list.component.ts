import { Component, OnInit, Input, OnChanges,SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
@Component({
  selector: 'app-purchase-list',
  templateUrl: './purchase-list.component.html',
  styleUrls: ['./purchase-list.component.css']
})
export class PurchaseListComponent implements OnInit,OnChanges {
  @Input() purchases: any =[];
  @Input() params: any;
  @Input() filtredPurchases: any = [];
  paginationForm: FormGroup;
  @Input() itemsPerPage: number = 5;
  smallnumPages: number = 0;
  startItem : number = 0;
  @Input() isOpen:boolean = false;
  endItem :number = 5;
  customClass = 'customClass';
 
  constructor(private fb: FormBuilder) {
   
  }
  get currentPage() { return this.paginationForm.get('currentPage') }
  ngOnInit() {
    this.paginationForm = this.fb.group({
      'currentPage': 1,
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if(!!this.paginationForm && !!changes.itemsPerPage && (changes.itemsPerPage.currentValue !== changes.itemsPerPage.previousValue))
      this.changePerPage(changes.itemsPerPage.currentValue);
  }

  public pageChanged(event: any): void {
    this.startItem = (event.page - 1) * event.itemsPerPage;
    this.endItem = event.page * event.itemsPerPage;
    this.currentPage.setValue(event.page);
  }

  changePerPage(number){
    this.currentPage.setValue(1);
    this.itemsPerPage = number;
    this.startItem = 0;
    this.endItem = number;
  }

  onPurchasesChanged(e){
    this.filtredPurchases = e.purchases;
    this.currentPage.setValue(1);
  }
}

import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { PurchaseMessageService } from 'src/app/core/services/purchase-message.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-purchase-list',
  templateUrl: './purchase-list.component.html',
  styleUrls: ['./purchase-list.component.css']
})
export class PurchaseListComponent implements OnInit, OnDestroy {
  @Input() purchases: any = [];
  @Input() params: any;
  subscription: Subscription;
  filtredPurchases: any = [];
  paginationForm: FormGroup;
  itemsPerPage: number = 10;
  smallnumPages: number = 0;
  startItem: number = 0;
  isOpen: boolean = false;
  endItem: number = 10;
  customClass = 'customClass';
  constructor(
    private fb: FormBuilder,
    private messageService: PurchaseMessageService,
  ) {

  }

  ngOnInit() {
    this.paginationForm = this.fb.group({
      'currentPage': [1],
    });
    this.subscription = this.messageService.getMessage().subscribe((data) => {
      if (data.source == 'filter' && data.type == 'purchases') {
        switch (data.changed) {
          case 'purchases':
            this.purchases = data.purchases;
            this.resetPagination(data.filter);
            break;
          case 'isOpen':
            this.isOpen = data.filter.isOpen;
            break;
          case 'itemsPerPage':
            this.resetPagination(data.filter);
            break;
          default:
            this.purchases = data.purchases;
            this.resetPagination();
            break;
        }
      }
    });

  }
  get currentPage() { return this.paginationForm.get('currentPage') }
  get totalPage() { return  Math.ceil(this.purchases.length/this.itemsPerPage)}
  ngOnDestroy() {
    if(this.subscription)
    this.subscription.unsubscribe();
  }

  public pageChanged(event: any): void {
    this.startItem = (event.page - 1) * event.itemsPerPage;
    this.endItem = event.page * event.itemsPerPage;
    this.currentPage.setValue(event.page);
  }

  resetPagination(dataFilter?) {
    this.currentPage.setValue(1);
    this.itemsPerPage = dataFilter.itemsPerPage;
    this.startItem = 0;
    this.endItem = dataFilter.itemsPerPage;
  }

 
}

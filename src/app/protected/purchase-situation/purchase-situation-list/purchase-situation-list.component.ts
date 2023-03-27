import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { PurchaseSituationService } from 'src/app/core/services/purchase-situation.service';
import { Subscription } from 'rxjs';
import { Observable} from 'rxjs';
@Component({
  selector: 'app-purchase-situation-list',
  templateUrl: './purchase-situation-list.component.html',
  styleUrls: ['./purchase-situation-list.component.css']
})
export class PurchaseSituationListComponent implements OnInit, OnDestroy {
  @Input() purchases: any = [];
  @Input() params: any;
  subscription: Subscription;
  filtredPurchases: any = [];
  paginationForm: FormGroup;
  @Input() itemsPerPage: number = 10;
  smallnumPages: number = 0;
  @Input() startItem: number = 0;
  @Input() isOpen: boolean = false;
  @Input() endItem: number = 10;
  
  customClass = 'customClass';
  element:any={};
  purchase$: Observable<any>;
  data :any = {};
  opened:any=[];
  constructor(
    private fb: FormBuilder,
    private purchaseService: PurchaseSituationService,
  ) {

  }

  ngOnInit() {
    this.paginationForm = this.fb.group({
      'currentPage': [1],
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

  loadItem(event: boolean, item: any) {
     this.opened[item.need_system_id]=event;
  }
}

import { Component, OnInit, Input, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { FilterAllPropertyPipe } from 'src/app/shared/pipes/filter-all-property.pipe';
import { FiltermultiPipe } from 'src/app/shared/pipes/filtermulti.pipe';
import { PurchaseMessageService } from 'src/app/core/services/purchase-message.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-purchase-filter',
  templateUrl: './purchase-filter.component.html',
  styleUrls: ['./purchase-filter.component.css']
})
export class PurchaseFilterComponent implements OnInit, OnDestroy {
  @Input() purchases: any;
  @Input() isOpen: boolean;
  @Input() itemsPerPage: any = 10;
  @Input() filteredlist: any;
  subscription: Subscription;

  filterForm: FormGroup;
  get filterCode() { return this.filterForm.get('filterCode') as any; }
  get filterLabel() { return this.filterForm.get('filterLabel') as any; }
  get validated() { return this.filterForm.get('validated') as any; }
  get refused() { return this.filterForm.get('refused') as any; }
  get instructed() { return this.filterForm.get('instructed') as any; }
  get created() { return this.filterForm.get('created') as any; }
  constructor(private fb: FormBuilder
    , private filterAllProperty: FilterAllPropertyPipe
    , private filtermultiPipe: FiltermultiPipe
    , private messageService: PurchaseMessageService
  ) {

  }
  ngOnInit() {
    this.filterForm = this.fb.group({
      'filterCode': '',
      'filterLabel': '',
      'validated': '',
      'refused': '',
      'instructed': '',
      'created': '',
    });

    this.subscription = this.messageService.getMessage().subscribe((data) => {
      if (data.source == 'form' && data.action=='get_all') {
        this.filterForm.reset();
      }
    });
  }

  clearFilter() {
    this.filterForm.reset();
    this.filter();
  }

  sort(params) {
    if (params.direction == 'asc') {
      this.filteredlist.sort((a, b) => {
        return (parseInt(a[params['column']]) < parseInt(b[params['column']])) ? -1 : 1;
      });
    } else {
      this.filteredlist.sort((a, b) => {
        return (parseInt(a[params['column']]) > parseInt(b[params['column']])) ? -1 : 1
      }
      );
    }
    this.notifyList('purchases');
  }

  sortText(params) {
    if (params.direction == 'asc') {
      this.filteredlist.sort((a, b) => a[params['column']].localeCompare(b[params['column']]));
    } else {
      this.filteredlist.sort((a, b) => b[params['column']].localeCompare(a[params['column']]));
    }
    this.notifyList('purchases');
  }
  sortDate(params) {
    if (params.direction == 'asc') {
      this.filteredlist.sort((a, b) => {
        return <any>new Date(a[params['column']]) - <any>new Date(b[params['column']]);
      });
    } else {
      this.filteredlist.sort((a, b) => {
        return <any>new Date(b[params['column']]) - <any>new Date(a[params['column']]);
      }
      );
    }
    this.notifyList('purchases');
  }

  public filter() {
    this.filteredlist = this.purchases;
    this.filteredlist = this.filterAllProperty.transform(this.filteredlist, this.filterCode.value, ["purchase_demand_id"], "start");
    this.filteredlist = this.filterAllProperty.transform(this.filteredlist, this.filterLabel.value, ["purchase_demand_label"], "like");
    this.filteredlist = this.filtermultiPipe.transform(this.filteredlist, [{
      'last_status_event': [(this.validated.value == true) ? 2 : "", (this.created.value == true) ? 1 : "",
      (this.instructed.value == true) ? 3 : "", (this.refused.value == true) ? 4 : ""]
    }]);
    this.notifyList('purchases');
  }

  open() {
    this.isOpen = true;
    this.notifyList('isOpen');
  }
  close() {
    this.isOpen = false;
    this.notifyList('isOpen');
  }
  changePerPage(number: number) {
    this.itemsPerPage = number;
    this.notifyList('itemsPerPage');
  }

  isFiltered() {

    return (!!this.filterCode.value
      || !!this.filterLabel.value
      || !!this.validated.value
      || !!this.created.value
      || !!this.instructed.value
      || !!this.refused.value

    )
  }

  notifyList(changed) {
    let search = {
       source:'filter',
       type:'purchases',
       changed: changed,
      'purchases': this.filteredlist,
      'filter': {
        'itemsPerPage': this.itemsPerPage,
        'isOpen': this.isOpen
      }
    }
    this.messageService.sendMessage(search);
  }

  ngOnDestroy() {
    if(this.subscription)
    this.subscription.unsubscribe();
  }
  
}
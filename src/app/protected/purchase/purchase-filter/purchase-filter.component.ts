import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { FilterAllPropertyPipe } from  'src/app/shared/pipes/filter-all-property.pipe';
import { FiltermultiPipe } from  'src/app/shared/pipes/filtermulti.pipe';
@Component({
  selector: 'app-purchase-filter',
  templateUrl: './purchase-filter.component.html',
  styleUrls: ['./purchase-filter.component.css']
})
export class PurchaseFilterComponent implements OnInit {
  @Output() purchasesChanged = new EventEmitter<any>();
  @Output() openCloseChanged = new EventEmitter<any>();
  @Output() itemsPerPageChanged = new EventEmitter<any>();
  @Input() purchases: any ;
  @Input() isOpen:boolean;
  @Input() itemsPerPage:any = 5;
  @Input() filteredlist : any;

  filterForm: FormGroup;
  get filterCode() { return this.filterForm.get('filterCode') as any; }
  get filterLabel() { return this.filterForm.get('filterLabel') as any; }
  get validated() { return this.filterForm.get('validated') as any; }
  get refused() { return this.filterForm.get('refused') as any; }
  get instructed() { return this.filterForm.get('instructed') as any; }
  get created() { return this.filterForm.get('created') as any; }
  constructor(private fb: FormBuilder
    ,private filterAllProperty: FilterAllPropertyPipe
    ,private filtermultiPipe: FiltermultiPipe
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
    this.purchasesChanged.emit({'purchases':this.filteredlist});
  }

  sortText(params) {
    if (params.direction == 'asc') {
      this.filteredlist.sort((a, b) => a[params['column']].localeCompare(b[params['column']]));
    } else {
      this.filteredlist.sort((a, b) => b[params['column']].localeCompare(a[params['column']]));
    }
    this.purchasesChanged.emit({'purchases':this.filteredlist});
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
    this.purchasesChanged.emit({'purchases':this.filteredlist});
  }

  public filter() {
    this.filteredlist = this.purchases;
    this.filteredlist = this.filterAllProperty.transform(this.filteredlist, this.filterCode.value, ["purchase_demand_id"], "start");
    this.filteredlist = this.filterAllProperty.transform(this.filteredlist, this.filterLabel.value, ["purchase_demand_label"], "like");
    this.filteredlist = this.filtermultiPipe.transform(this.filteredlist, [{'last_status_event': [(this.validated.value == true) ? 2 : "", (this.created.value == true) ? 1 : "",
      (this.instructed.value == true) ? 3 : "", (this.refused.value == true) ? 4 : ""]
    }]);
    this.purchasesChanged.emit({'purchases':this.filteredlist});
  }

  open(){
    this.openCloseChanged.emit({'isOpen':true});
    this.isOpen = true;
  }
  close(){
    this.openCloseChanged.emit({'isOpen':false});
    this.isOpen = false;
  }
  changePerPage(number:number){
    this.itemsPerPageChanged.emit(number);
  }
}
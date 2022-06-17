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
  validated:boolean=false;
  created:boolean=false;
  instructed:boolean=false;
  refused:boolean=false;
  initialized:boolean=false;
  transmitted:boolean=false;
  managed:boolean=false;
  affected:boolean=false;
  integred:boolean=false;

  sortNuméro:boolean=false;
  sortLibellé:boolean=false;
  sortCrée:boolean=false;
  sortStatut:boolean=false;
  sortStatutModif:boolean=false;

  subscription: Subscription;

  filterForm: FormGroup;
  get filterCode() { return this.filterForm.get('filterCode') as any; }
  get filterLabel() { return this.filterForm.get('filterLabel') as any; }
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
    });

    this.subscription = this.messageService.getMessage().subscribe((data) => {
      if (data.source == 'form' && data.action=='get_all') {
        this.filterForm.reset();
        this.initialized=this.transmitted= this.managed=this.affected=this.integred = this.integred= false;
      }
    });
  }

  clearFilter() {
    this.filterForm.reset();
    this.initialized=this.transmitted= this.managed=this.affected=this.integred = this.integred= false;
    //this.validated=this.created= this.instructed=this.refused=false;
    this.filter();
  }

  sort(params) {
    if(params['column'] == 'purchase_demand_id')
    {  
      if(this.sortNuméro) {
        this.filteredlist.sort((a, b) => {
          return (parseInt(a[params['column']]) < parseInt(b[params['column']])) ? -1 : 1;
        });
      } else {
        this.filteredlist.sort((a, b) => {
          return (parseInt(a[params['column']]) > parseInt(b[params['column']])) ? -1 : 1
        }
        );
      }
      this.sortNuméro = !this.sortNuméro;
    }
    else
    {
      if(this.sortStatut) {
        this.filteredlist.sort((a, b) => {
          return (parseInt(a[params['column']]) < parseInt(b[params['column']])) ? -1 : 1;
        });
      } else {
        this.filteredlist.sort((a, b) => {
          return (parseInt(a[params['column']]) > parseInt(b[params['column']])) ? -1 : 1
        }
        );
      }
      this.sortStatut = !this.sortStatut;
    }

    this.notifyList('purchases');
  }

  sortText(params) {
    if(params['column'] == 'purchase_demand_label'){
      if (this.sortLibellé) {
        this.filteredlist.sort((a, b) => a[params['column']].localeCompare(b[params['column']]));
      } else {
        this.filteredlist.sort((a, b) => b[params['column']].localeCompare(a[params['column']]));
      }
      this.sortLibellé = !this.sortLibellé;
    }
      this.notifyList('purchases');
  }
  sortDate(params) {
    if(params['column'] == 'purchase_created_date'){
      if (this.sortCrée) {
        this.filteredlist.sort((a, b) => {
          return <any>new Date(a[params['column']]) - <any>new Date(b[params['column']]);
        });
      } else {
        this.filteredlist.sort((a, b) => {
          return <any>new Date(b[params['column']]) - <any>new Date(a[params['column']]);
        }
        );
      }
      this.sortCrée = !this.sortCrée;
    }
    else{
      if (this.sortStatutModif) {
        this.filteredlist.sort((a, b) => {
          return <any>new Date(a[params['column']]) - <any>new Date(b[params['column']]);
        });
      } else {
        this.filteredlist.sort((a, b) => {
          return <any>new Date(b[params['column']]) - <any>new Date(a[params['column']]);
        }
        );
      }
      this.sortStatutModif = !this.sortStatutModif;

    }
      this.notifyList('purchases');
  }

  public changeStatus(params) {
    switch(params.status){
      case'initialized':
      this.initialized = !this.initialized;
      break;
      case'transmitted':
      this.transmitted = !this.transmitted;
      break;
      case'managed':
      this.managed = !this.managed;
      break;
      case'affected':
      this.affected = !this.affected;
      break;
      case'integred':
      this.integred = !this.integred;
      break;
      case'refused':
      this.refused = !this.refused;
      break;
    }
    this.filter();
  }

  public filter() {
    this.filteredlist = this.purchases;
    this.filteredlist = this.filterAllProperty.transform(this.filteredlist, this.filterCode.value, ["purchase_demand_id"], "start");
    this.filteredlist = this.filterAllProperty.transform(this.filteredlist, this.filterLabel.value, ["purchase_demand_label"], "like");
   /* this.filteredlist = this.filtermultiPipe.transform(this.filteredlist, [{
      'last_status_event': [(this.validated == true) ? 2 : "", (this.created == true) ? 1 : "",
      (this.instructed == true) ? 3 : "", (this.refused == true) ? 4 : ""]
    }]);*/
    this.filteredlist = this.filtermultiPipe.transform(this.filteredlist, [{
      'last_status_event': [(this.initialized == true) ? 1 : "", (this.transmitted == true) ? 2 : "",
      (this.managed == true) ? 3 : "", (this.affected == true) ? 4 : "", (this.integred == true) ? 5 : "", (this.refused == true) ? 6 : ""]
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
      || !!this.initialized
      || !!this.transmitted
      || !!this.managed
      || !!this.affected
      || !!this.integred
      || !!this.refused
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
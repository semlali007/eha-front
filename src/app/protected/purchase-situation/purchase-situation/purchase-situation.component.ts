import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { PurchaseSituationService } from 'src/app/core/services/purchase-situation.service';
import { DateService } from 'src/app/core/services/date.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FilterAllPropertyPipe } from 'src/app/shared/pipes/filter-all-property.pipe';

@Component({
  selector: 'app-search',
  templateUrl: './purchase-situation.component.html',
  styleUrls: ['./purchase-situation.component.css']
})
export class PurchaseSituationComponent implements OnInit, OnDestroy {
  purchases: any = [];
  params: any = { words: "", offset: 0 };
  private subscription: Subscription;
  isOpen: boolean;
  itemsPerPage: any = 10;
  filteredlist: any = [];
  filterForm: FormGroup;
  get filterCode() { return this.filterForm?.get('filterCode') as any; }
  get filterLabel() { return this.filterForm?.get('filterLabel') as any; }
  constructor(
    private purchaseSituationService: PurchaseSituationService,
    private fb: FormBuilder,
    private filterAllProperty: FilterAllPropertyPipe
  ) {
  }

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      'filterCode': '',
      'filterLabel': '',
       initialized: [false],
       transmitted: [false],
       managed: [false],
       affected: [false],
       integred: [false],
       refused: [false],
    });
  }

  loadData(params: any) {
    console.log('ok');
    this.subscription = this.purchaseSituationService.search(params).subscribe(response => {
      this.purchases = [];
      let list = [];
      if (params.words) {
        let result = response.find(obj => {
          return obj.purchase_demand_id == params.words
        });
        if (result)
          list.push(result);
      } else {
        list = response;
      }

      let allItems = this.purchaseSituationService.sortDate({'column':'PurchaseSituation_created_date', 'direction':'desc'}, list);
      allItems.forEach(p => {
        this.purchases.push(
          {
            need_system_id: p['need_system_id'],
            need_mtb_desc: p['need_mtb_desc'],
            need_system_validation_date: p['need_system_validation_date'],
            main_mtb_status_label: p['main_mtb_status_label'],
            main_mtb_status_last_event_date: p['main_mtb_status_last_event_date'] || '',
            owner_label: p['owner_label'],
            mtb_purchase_category_label_list: p['mtb_purchase_category_label_list'],
            buyer_party_level_1_label: p['buyer_party_level_1_label'],
            buyer_party_level_2_label: p['buyer_party_level_2_label'],
            contract_awarding_id: p['contract_awarding_id'],
            
          }
        );
        this.filteredlist = this.purchases;
      });
    })
  }

  onSubmittedForm(params: any) {
    this.params = params;
    this.loadData(params);
  }
  ngOnDestroy() {
    if(this.subscription)
    this.subscription.unsubscribe();
  }

  isFiltered() {
    return true;
  }
  open() {
    this.isOpen = true;
  }
  close() {
    this.isOpen = false;
  }

  sort(params) {
    this.filteredlist = this.purchaseSituationService.sort(params, this.filteredlist).slice();
  }

  sortText(params) {
    this.filteredlist = this.purchaseSituationService.sortText(params, this.filteredlist).slice();
  }

  sortDate(params) {
    this.filteredlist = this.purchaseSituationService.sortDate(params, this.filteredlist).slice();
  }    

  public filter() {
    this.filteredlist = this.purchases;
    this.filteredlist = this.filterAllProperty.transform(this.filteredlist, this.filterCode.value, ["need_system_id"], "start");
    this.filteredlist = this.filterAllProperty.transform(this.filteredlist, this.filterLabel.value, ["need_mtb_desc"], "like");
  }

}

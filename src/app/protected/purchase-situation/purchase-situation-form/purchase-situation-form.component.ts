import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'src/app/core/services/message.service';
import { PurchaseSituationService } from 'src/app/core/services/purchase-situation.service';
import { ExcelService } from 'src/app/core/services/excel.service';
import { PurchaseStatus } from 'src/app/shared/models/purchaseStatus';
//import { PurchaseMessageService } from 'src/app/core/services/purchase-situation-message.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-purchase-situation-form',
  templateUrl: './purchase-situation-form.component.html',
  styleUrls: ['./purchase-situation-form.component.css']
})
export class PurchaseSituationFormComponent implements OnInit, OnDestroy {
  searchForm: FormGroup;
  subscription: Subscription;
  searchText: string;
  @Output() submittedForm = new EventEmitter<any>();
  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    //private purchaseMessageService: PurchaseMessageService,
    private purchaseService: PurchaseSituationService,
    private excelService: ExcelService,
    
  ) { }

  ngOnInit(): void {
    this.createSearchForm();
    this.subscription = this.messageService.getMessage().subscribe((searchData) => {
      if (!!searchData && !!searchData.type && (searchData.type == 'purchase')) {
        this.words.setValue(searchData.searchText);
    }
    
      this.submit();
    });
  }

  get words() { return this.searchForm.get('words') }

  createSearchForm(): FormGroup {
    return this.searchForm = this.fb.group({
      'words': ['', [
				Validators.required,
				Validators.minLength(10),
				Validators.maxLength(10),
			  Validators.pattern('^[1]{1}[0-9]{9}$')
			]
    ],
    });
  }

  submit() {
    let params: any = { words: this.words.value };
    this.submittedForm.emit(params);
  }

  showAll() {
    this.searchForm.reset();
   // this.purchaseMessageService.sendMessage({'source':'form','action':'get_all'});
    this.submit();
  }
  
ngOnDestroy(): void {
  if(this.subscription)
  this.subscription.unsubscribe();
}

  download() {
    this.purchaseService.search({ words: this.words.value }).subscribe((response: any) => {
      const purchases: any = [];
      response.forEach(data => {
         purchases.push({
           code:data.purchase_demand_id,
           label: data.purchase_demand_label,
           created:data.purchase_created_date,
           status:  new PurchaseStatus({ code: data.last_status_event }).getLabel(),
           status_date: data.last_status_date,
         });
       });

      this.excelService.generateExcel({header:[
        'Numéro', 'Libellé', 'Crée le', 'Statut', 'Statut modifié le'
      ],data:purchases}, { sheet: 'DA', name: "mes demandes d'achat.xlsx" });
    });
  }

}

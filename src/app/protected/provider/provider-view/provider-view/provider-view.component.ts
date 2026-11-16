import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ProviderService } from 'src/app/core/services/provider.service';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'provider-view',
  templateUrl: './provider-view.component.html',
  styleUrls: ['./provider-view.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ProviderViewComponent implements OnInit {
  public code: string = '';
  public provider: any = {};
  filterForm: FormGroup;
    get contractFilterText() { return this.filterForm.get('contractFilterText') as any; }



  constructor(
    private providerService: ProviderService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private location: Location
  ) {
  }

  back(): void {
    this.location.back();
  }

  public hasAddress(): boolean {
    const i = this.provider?.infos;
    return !!(i && (i.supplier_business_unit_address_street || i.supplier_business_unit_address_postal_zone || i.supplier_business_unit_address_town));
  }

  public getActiveContracts(): any[] {
    return (this.provider?.contracts || []).filter(c => !!c?.contract_code);
  }

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      'contractFilterText': '',
    });
    this.route.params.subscribe(params => {
      if (!!params.code) {
        this.code = params.code;
        this.loadElement();
      }
    });
  }

  loadElement() {
    this.providerService.get({
      code: this.code,
    }).subscribe(element => {
      if (!element) return;
      this.provider = element;
    });
  }
  public showProvider(providerCode): void {
    this.router.navigate([`app/fournisseur/details/${providerCode}`]);
  }

  public showContract(contractCode): void {
    this.router.navigate([`app/contrat/details/${contractCode}`]);
  }
  

}

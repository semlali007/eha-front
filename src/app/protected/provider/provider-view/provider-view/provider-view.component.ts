import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProviderService } from 'src/app/core/services/provider.service';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'provider-view',
  templateUrl: './provider-view.component.html',
  styles: [
  ]
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
    private fb: FormBuilder
  ) {
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

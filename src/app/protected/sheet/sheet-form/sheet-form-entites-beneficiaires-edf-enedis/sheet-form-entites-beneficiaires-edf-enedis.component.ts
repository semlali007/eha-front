import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-sheet-form-entites-beneficiaires-edf-enedis',
  templateUrl: './sheet-form-entites-beneficiaires-edf-enedis.component.html',
  styleUrls: ['./sheet-form-entites-beneficiaires-edf-enedis.component.css']
})
export class SheetFormEntitesBeneficiairesEdfEnedisComponent implements OnInit {
  @Input() entitesBeneficiairesEdfEnedis: FormControl;
  
  constructor() { }
  
  ngOnInit(): void {
    const savedEntitesBeneficiairesEdfEnedis = localStorage.getItem('entitesBeneficiairesEdfEnedis');
    if (savedEntitesBeneficiairesEdfEnedis) {
      this.entitesBeneficiairesEdfEnedis.setValue(savedEntitesBeneficiairesEdfEnedis);
    }

    this.entitesBeneficiairesEdfEnedis.valueChanges.subscribe(value => {
      localStorage.setItem('entitesBeneficiairesEdfEnedis', value);
    });
  }
}

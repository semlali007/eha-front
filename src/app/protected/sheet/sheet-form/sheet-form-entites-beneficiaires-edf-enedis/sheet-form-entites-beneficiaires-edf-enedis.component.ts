import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-sheet-form-entites-beneficiaires-edf-enedis',
  templateUrl: './sheet-form-entites-beneficiaires-edf-enedis.component.html',
  styleUrls: ['./sheet-form-entites-beneficiaires-edf-enedis.component.css']
})
export class SheetFormEntitesBeneficiairesEdfEnedisComponent implements OnInit {
  @Input() entitesBeneficiairesEdfEnedis: FormControl;
  @Input() mode: 'create' | 'edit' = 'edit'; // Nouveau: mode passé par le parent
  
  constructor() { }
  
  ngOnInit(): void {
    // Ne charger le localStorage QUE si on n'est PAS en mode création
    if (this.mode !== 'create') {
      const savedEntitesBeneficiairesEdfEnedis = localStorage.getItem('entitesBeneficiairesEdfEnedis');
      if (savedEntitesBeneficiairesEdfEnedis) {
        this.entitesBeneficiairesEdfEnedis.setValue(savedEntitesBeneficiairesEdfEnedis);
      }
    }

    // Sauvegarder les changements dans localStorage - mais pas en mode création
    this.entitesBeneficiairesEdfEnedis.valueChanges.subscribe(value => {
      if (this.mode !== 'create') {
        localStorage.setItem('entitesBeneficiairesEdfEnedis', value);
      }
    });
  }
}

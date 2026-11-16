import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-sheet-form-supplier-vat-number',
  templateUrl: './sheet-form-supplier-vat-number.component.html',
  styleUrls: ['./sheet-form-supplier-vat-number.component.css']
})
export class SheetFormSupplierVatNumberComponent implements OnInit {
  @Input() supplierVatNumber: FormControl;
  @Input() mode: 'create' | 'edit' = 'edit'; // Nouveau: mode passé par le parent
  
  constructor() { }
  
  ngOnInit(): void {
    // Ne restaurer le localStorage QUE si on n'est PAS en mode création
    if (this.mode !== 'create') {
      const savedSupplierVatNumber = localStorage.getItem('supplierVatNumber');
      if (savedSupplierVatNumber) {
        this.supplierVatNumber.setValue(savedSupplierVatNumber);
      }
    }

    // Sauvegarder seulement si on n'est PAS en mode création
    this.supplierVatNumber.valueChanges.subscribe(value => {
      if (this.mode !== 'create') {
        localStorage.setItem('supplierVatNumber', value);
      }
    });
  }
}

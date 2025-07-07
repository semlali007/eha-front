import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-sheet-form-supplier-vat-number',
  templateUrl: './sheet-form-supplier-vat-number.component.html',
  styleUrls: ['./sheet-form-supplier-vat-number.component.css']
})
export class SheetFormSupplierVatNumberComponent implements OnInit {
  @Input() supplierVatNumber: FormControl;
  
  constructor() { }
  
  ngOnInit(): void {
    const savedSupplierVatNumber = localStorage.getItem('supplierVatNumber');
    if (savedSupplierVatNumber) {
      this.supplierVatNumber.setValue(savedSupplierVatNumber);
    }

    this.supplierVatNumber.valueChanges.subscribe(value => {
      localStorage.setItem('supplierVatNumber', value);
    });
  }
}

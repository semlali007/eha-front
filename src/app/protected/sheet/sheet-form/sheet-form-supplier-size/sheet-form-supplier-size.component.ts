import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SupplierSizeService } from 'src/app/core/services/supplier-size.service';

@Component({
  selector: 'app-sheet-form-supplier-size',
  templateUrl: './sheet-form-supplier-size.component.html',
  styleUrls: ['./sheet-form-supplier-size.component.css']
})
export class SheetFormSupplierSizeComponent implements OnInit {

  @Input() supplierSize: FormControl;
  supplierSizes: any[] = [];

  constructor(private supplierSizeService: SupplierSizeService) { }

  ngOnInit(): void {
    // Ensure FormControl exists
    if (!this.supplierSize) {
      console.warn('supplierSize FormControl not provided');
    }

    // Charger les tailles de fournisseurs depuis l'API
    this.loadSupplierSizes();
  }

  private loadSupplierSizes(): void {
    this.supplierSizeService.getSupplierSizes().subscribe({
      next: (supplierSizes) => {
        this.supplierSizes = supplierSizes;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des tailles de fournisseurs:', error);
        this.supplierSizes = [];
      }
    });
  }

}

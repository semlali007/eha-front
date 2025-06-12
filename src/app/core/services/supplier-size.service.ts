import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AppConfigService } from './app-config.service';

export interface SupplierSize {
  id: number;
  name: string;
  is_active: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SupplierSizeService {

  private supplierSizes: SupplierSize[] = [];

  constructor(
    private http: HttpClient,
    private appConfigService: AppConfigService
  ) { }

  getSupplierSizes(): Observable<SupplierSize[]> {
    // Si déjà en cache, retourner directement
    if (this.supplierSizes.length > 0) {
      return of(this.supplierSizes);
    }

    // Sinon, récupérer depuis l'API
    const url = `${this.appConfigService.basePath}/supplier-sizes`;
    return this.http.get<{supplier_sizes: SupplierSize[]}>(url).pipe(
      map(response => {
        this.supplierSizes = response.supplier_sizes.filter(size => size.is_active);
        return this.supplierSizes;
      }),
      catchError(error => {
        console.error('Erreur lors de la récupération des tailles de fournisseur:', error);        // Fallback avec les valeurs par défaut si l'API échoue
        this.supplierSizes = [
          { id: 1, name: 'PME', is_active: true },
          { id: 2, name: 'ETI', is_active: true },
          { id: 3, name: 'GE', is_active: true }
        ];
        return of(this.supplierSizes);
      })
    );
  }

  getSupplierSizeById(id: number): SupplierSize | null {
    return this.supplierSizes.find(size => size.id === id) || null;
  }
  getSupplierSizeByName(name: string): SupplierSize | null {
    return this.supplierSizes.find(size => size.name === name) || null;
  }
}

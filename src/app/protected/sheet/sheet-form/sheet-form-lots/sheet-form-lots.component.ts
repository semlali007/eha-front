import { Component, OnInit, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-sheet-form-lots',
  templateUrl: './sheet-form-lots.component.html',
  styles: [
  ]
})
export class SheetFormLotsComponent implements OnInit {
  @Input() lots: FormArray;
  @Input() sheetForm: FormGroup;
  @Input() mode: 'create' | 'edit' = 'edit'; // Nouveau: mode passé par le parent
  @Input() sheetId: string | null = null; // Pour distinguer nouveau vs édition existante
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    // Charger localStorage SEULEMENT si :
    // 1. Mode création (pas d'ID de fiche) OU
    // 2. Mode édition mais FormArray vide (nouveau formulaire en cours)
    // MAIS JAMAIS si on édite une fiche existante (sheetId existe et FormArray a des données)
    const shouldLoadFromStorage = this.mode !== 'create' && 
                                 this.lots.length === 0 && 
                                 !this.sheetId; // Pas d'édition de fiche existante
    
    if (shouldLoadFromStorage) {
      const savedLots = localStorage.getItem('lots');
      if (savedLots) {
        try {
          const parsedLots = JSON.parse(savedLots);
          parsedLots.forEach((lot: any) => {
            const lotGroup = this.fb.group({
              name: lot.name,
              description: lot.description
            });
            this.lots.push(lotGroup);
          });
        } catch (error) {
          console.warn('Erreur lors du chargement des lots depuis localStorage:', error);
        }
      }
    }
    
    // Sauvegarder les changements dans localStorage - mais pas en mode création
    this.lots.valueChanges.subscribe(value => {
      if (value !== null && value !== undefined && this.mode !== 'create') {
        localStorage.setItem('lots', JSON.stringify(value));
      }
    });
  }

  onAddedLot() {
    const lotGroup = this.fb.group({
      'name': '',
      'description': ''
    });
    this.lots.push(lotGroup);
  }

  onRemovedLot(index: number) {
    this.lots.removeAt(index);
  }
}

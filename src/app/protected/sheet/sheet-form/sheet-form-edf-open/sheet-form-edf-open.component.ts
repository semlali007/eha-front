import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sheet-form-edf-open',
  templateUrl: './sheet-form-edf-open.component.html',
  styles: []
})
export class SheetFormEdfOpenComponent implements OnInit, OnDestroy {
  @Input() edf_open: FormControl;
  @Input() mode: 'create' | 'edit' = 'edit'; // Nouveau: mode passé par le parent
  private valueChangesSubscription: Subscription;

  constructor() { }

  ngOnInit(): void {
    if (this.edf_open) {
      // Ne charger le localStorage QUE si on n'est PAS en mode création
      if (this.mode !== 'create') {
        this.loadEdfOpenFromLocalStorage();
      }
      this.subscribeToValueChanges();
    } else {
      console.error('FormControl edf_open is not initialized.');
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeFromValueChanges();
  }

  private loadEdfOpenFromLocalStorage(): void {
    const savedValue = localStorage.getItem('edf_open');
    if (savedValue !== null) {
      this.edf_open.setValue(savedValue === 'true');
    }
  }

  private subscribeToValueChanges(): void {
    this.valueChangesSubscription = this.edf_open.valueChanges.subscribe(value => {
      // Sauvegarder dans localStorage - mais pas en mode création
      if (value !== null && value !== undefined && this.mode !== 'create') {
        localStorage.setItem('edf_open', value.toString());
      }
    });
  }

  private unsubscribeFromValueChanges(): void {
    if (this.valueChangesSubscription) {
      this.valueChangesSubscription.unsubscribe();
    }
  }
}

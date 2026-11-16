import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sheet-form-dauphin',
  templateUrl: './sheet-form-dauphin.component.html',
  styles: []
})
export class SheetFormDauphinComponent implements OnInit, OnDestroy {
  @Input() dauphin: FormControl;
  @Input() mode: 'create' | 'edit' = 'edit'; // Nouveau: mode passé par le parent
  private valueChangesSubscription: Subscription;

  constructor() { }

  ngOnInit(): void {
    if (this.dauphin) {
      // Ne charger le localStorage QUE si on n'est PAS en mode création
      if (this.mode !== 'create') {
        this.loadDauphinFromLocalStorage();
      }
      this.subscribeToValueChanges();
    } else {
      console.error('FormControl dauphin is not initialized.');
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeFromValueChanges();
  }

  private loadDauphinFromLocalStorage(): void {
    const savedDauphin = localStorage.getItem('dauphin');
    if (savedDauphin !== null) {
      this.dauphin.setValue(savedDauphin === 'true');
    }
  }

  private subscribeToValueChanges(): void {
    this.valueChangesSubscription = this.dauphin.valueChanges.subscribe(value => {
      // Sauvegarder dans localStorage - mais pas en mode création
      if (value !== null && value !== undefined && this.mode !== 'create') {
        localStorage.setItem('dauphin', value.toString());
      }
    });
  }

  private unsubscribeFromValueChanges(): void {
    if (this.valueChangesSubscription) {
      this.valueChangesSubscription.unsubscribe();
    }
  }
}

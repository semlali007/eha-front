import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sheet-form-protected-sector',
  templateUrl: './sheet-form-protected-sector.component.html',
  styles: []
})
export class SheetFormProtectedSectorComponent implements OnInit, OnDestroy {
  @Input() protected_sector: FormControl;
  private valueChangesSubscription: Subscription;

  constructor() { }

  ngOnInit(): void {
    if (this.protected_sector) {
      this.loadProtectedSectorFromLocalStorage();
      this.subscribeToValueChanges();
    } else {
      console.error('FormControl protected_sector is not initialized.');
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeFromValueChanges();
  }

  private loadProtectedSectorFromLocalStorage(): void {
    const savedValue = localStorage.getItem('protected_sector');
    if (savedValue !== null) {
      this.protected_sector.setValue(savedValue === 'true');
    }
  }

  private subscribeToValueChanges(): void {
    this.valueChangesSubscription = this.protected_sector.valueChanges.subscribe(value => {
      if (value !== null && value !== undefined) {
        localStorage.setItem('protected_sector', value.toString());
      }
    });
  }

  private unsubscribeFromValueChanges(): void {
    if (this.valueChangesSubscription) {
      this.valueChangesSubscription.unsubscribe();
    }
  }
}

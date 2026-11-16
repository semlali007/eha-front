import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sheet-form-partnership',
  templateUrl: './sheet-form-partnership.component.html',
  styleUrls: ['./sheet-form-partnership.component.css']
})
export class SheetFormPartnershipComponent implements OnInit, OnDestroy {
  @Input() partnership: FormControl;
  private valueChangesSubscription: Subscription;

  constructor() { }

  ngOnInit(): void {
    if (this.partnership) {
      this.loadPartnershipFromLocalStorage();
      this.subscribeToValueChanges();
    } else {
      console.error('FormControl partnership is not initialized.');
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeFromValueChanges();
  }

  private loadPartnershipFromLocalStorage(): void {
    const savedValue = localStorage.getItem('partnership');
    if (savedValue !== null) {
      this.partnership.setValue(savedValue === 'true');
    }
  }

  private subscribeToValueChanges(): void {
    this.valueChangesSubscription = this.partnership.valueChanges.subscribe(value => {
      if (value !== null && value !== undefined) {
        localStorage.setItem('partnership', value.toString());
      }
    });
  }

  private unsubscribeFromValueChanges(): void {
    if (this.valueChangesSubscription) {
      this.valueChangesSubscription.unsubscribe();
    }
  }
}

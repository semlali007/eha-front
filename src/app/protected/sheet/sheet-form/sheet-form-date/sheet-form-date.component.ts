import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { SheetService } from 'src/app/core/services/sheet.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sheet-form-date',
  templateUrl: './sheet-form-date.component.html',
  styleUrls: ['./sheet-form-date.component.css']
})
export class SheetFormDateComponent implements OnInit, OnDestroy {
  @Input() startDate: FormControl;
  @Input() endDate: FormControl;
  @Input() sheetForm: FormGroup;
  @Input() mode: 'create' | 'edit' = 'edit'; // Nouveau: mode passé par le parent

  private startDateSubscription: Subscription;
  private endDateSubscription: Subscription;

  constructor(private localeService: BsLocaleService, private sheetService: SheetService) { }

  ngOnInit(): void {
    if (this.startDate && this.endDate && this.sheetForm) {
      this.localeService.use('fr');
      
      // Ne charger le localStorage QUE si on n'est PAS en mode création
      if (this.mode !== 'create') {
        this.loadDatesFromLocalStorage();
      }
      
      this.subscribeToDateChanges();
    } else {
      console.error('FormControls startDate, endDate, or sheetForm are not initialized.');
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeFromDateChanges();
  }

  private loadDatesFromLocalStorage(): void {
    const savedStartDate = localStorage.getItem('startDate');
    if (savedStartDate) {
      this.startDate.setValue(new Date(savedStartDate));
    }

    const savedEndDate = localStorage.getItem('endDate');
    if (savedEndDate) {
      this.endDate.setValue(new Date(savedEndDate));
    }
  }

  private subscribeToDateChanges(): void {
    this.startDateSubscription = this.startDate.valueChanges.subscribe(value => {
      // Sauvegarder seulement si on n'est PAS en mode création
      if (value && this.mode !== 'create') {
        localStorage.setItem('startDate', new Date(value).toISOString());
      }
    });

    this.endDateSubscription = this.endDate.valueChanges.subscribe(value => {
      // Sauvegarder seulement si on n'est PAS en mode création
      if (value && this.mode !== 'create') {
        localStorage.setItem('endDate', new Date(value).toISOString());
      }
    });
  }

  private unsubscribeFromDateChanges(): void {
    if (this.startDateSubscription) {
      this.startDateSubscription.unsubscribe();
    }
    if (this.endDateSubscription) {
      this.endDateSubscription.unsubscribe();
    }
  }

  onValueChange(value: Date): void {
    if (value) {
      this.sheetForm.get('endDate').setValue(value);
    }
    this.sheetService.sheetValidate(this.sheetForm);
  }
}

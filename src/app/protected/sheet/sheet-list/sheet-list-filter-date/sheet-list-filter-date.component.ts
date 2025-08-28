import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, Subject } from 'rxjs';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-sheet-list-filter-date',
  templateUrl: './sheet-list-filter-date.component.html',
  styleUrls: ['./sheet-list-filter-date.component.scss']
})
export class SheetListFilterDateComponent implements OnInit, OnDestroy {
  @Input() resetFilters$: Subject<void>;
  @Output() onFiltersChange = new EventEmitter<{dateStart: string, dateEnd: string}>();

  dateForm: FormGroup;
  private subscriptions: Subscription = new Subscription();
  isTotalCollapsed: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private localeService: BsLocaleService
  ) {
    // Configuration locale française pour les calendriers
    this.localeService.use('fr');
  }

  ngOnInit(): void {
    this.initializeForm();
    this.setupFormSubscriptions();
    this.setupResetSubscription();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private initializeForm(): void {
    this.dateForm = this.formBuilder.group({
      dateStart: [null],
      dateEnd: [null]
    }, {
      validators: this.dateRangeValidator
    });
  }

  private setupFormSubscriptions(): void {
    const formSubscription = this.dateForm.valueChanges.subscribe(value => {
      if (this.dateForm.valid) {
        const dateStart = value.dateStart ? this.formatDate(value.dateStart) : '';
        const dateEnd = value.dateEnd ? this.formatDate(value.dateEnd) : '';
        this.onFiltersChange.emit({ dateStart, dateEnd });
      }
    });

    this.subscriptions.add(formSubscription);
  }

  private setupResetSubscription(): void {
    if (this.resetFilters$) {
      const resetSubscription = this.resetFilters$.subscribe(() => {
        this.resetForm();
      });
      this.subscriptions.add(resetSubscription);
    }
  }

  private resetForm(): void {
    this.dateForm.reset();
    this.onFiltersChange.emit({ dateStart: '', dateEnd: '' });
  }

  private formatDate(date: Date): string {
    if (!date) return '';
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }

  // Validateur personnalisé pour s'assurer que la date de fin est après la date de début
  private dateRangeValidator(form: FormGroup): {[key: string]: any} | null {
    const dateStart = form.get('dateStart')?.value;
    const dateEnd = form.get('dateEnd')?.value;

    if (dateStart && dateEnd && dateStart > dateEnd) {
      return { dateRangeInvalid: true };
    }

    return null;
  }

  // Getter pour faciliter l'accès aux erreurs dans le template
  get dateRangeError(): boolean {
    return this.dateForm.hasError('dateRangeInvalid') && 
           (this.dateForm.get('dateStart')?.touched || this.dateForm.get('dateEnd')?.touched);
  }

  // Méthode pour effacer les filtres
  clearFilters(): void {
    this.resetForm();
  }

  // Vérifie si le filtre est actif
  hasActiveFilter(): boolean {
    return !!(this.dateForm.get('dateStart')?.value || this.dateForm.get('dateEnd')?.value);
  }
}

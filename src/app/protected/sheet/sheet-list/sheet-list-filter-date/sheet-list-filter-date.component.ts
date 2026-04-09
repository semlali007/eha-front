import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription, Subject } from 'rxjs';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-sheet-list-filter-date',
  templateUrl: './sheet-list-filter-date.component.html',
  styleUrls: ['./sheet-list-filter-date.component.scss'],
})
export class SheetListFilterDateComponent implements OnInit, OnDestroy {
  @Input() resetFilters$: Subject<void>;
  @Output() onFiltersChange = new EventEmitter<{ dateStart: string; dateEnd: string }>();

  dateForm: FormGroup;
  isTotalCollapsed = false;

  private subscriptions = new Subscription();
  private isResetting = false;

  constructor(
    private formBuilder: FormBuilder,
    private localeService: BsLocaleService,
  ) {
    this.localeService.use('fr');
  }

  ngOnInit(): void {
    this.dateForm = this.formBuilder.group(
      { dateStart: [null], dateEnd: [null] },
      { validators: this.dateRangeValidator },
    );

    this.subscriptions.add(
      this.dateForm.valueChanges.subscribe((value) => {
        if (this.dateForm.valid && !this.isResetting) {
          this.onFiltersChange.emit({
            dateStart: value.dateStart ? this.formatDate(value.dateStart) : '',
            dateEnd: value.dateEnd ? this.formatDate(value.dateEnd) : '',
          });
        }
      }),
    );

    if (this.resetFilters$) {
      this.subscriptions.add(
        this.resetFilters$.subscribe(() => this.resetForm()),
      );
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  clearFilters(): void {
    this.resetForm();
  }

  hasActiveFilter(): boolean {
    return !!(
      this.dateForm.get('dateStart')?.value ||
      this.dateForm.get('dateEnd')?.value
    );
  }

  get dateRangeError(): boolean {
    return (
      this.dateForm.hasError('dateRangeInvalid') &&
      (this.dateForm.get('dateStart')?.touched ||
        this.dateForm.get('dateEnd')?.touched)
    );
  }

  private resetForm(): void {
    this.isResetting = true;
    this.dateForm.reset();
    this.isResetting = false;
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private dateRangeValidator(form: FormGroup): { [key: string]: any } | null {
    const dateStart = form.get('dateStart')?.value;
    const dateEnd = form.get('dateEnd')?.value;
    if (dateStart && dateEnd && dateStart > dateEnd) {
      return { dateRangeInvalid: true };
    }
    return null;
  }
}

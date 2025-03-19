import { Component, OnInit, Output, EventEmitter, OnDestroy, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MessageService } from 'src/app/core/services/message.service';
@Component({
  selector: 'app-sheet-list-sort',
  templateUrl: './sheet-list-sort.component.html',
  styles: [
  ]
})

export class SheetListSortComponent implements OnInit, OnDestroy {
  stateClosed: boolean = true;
  sheetSortForm: FormGroup;
  @Input() defaultFilter : any;
  public subscription: Subscription;
  @Output() changedSort = new EventEmitter<Object>();
  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
  ) {
  }
  get sortBy() { return this.sheetSortForm.get('sortBy') }

  ngOnInit(): void {
    this.initForm();
    this.subscription = this.messageService.getMessage().subscribe((init) => {
      if (!!init && !!init.initSheetSortBy && (init.initSheetSortBy === true)) {
        this.resetForm();
      }
    });
  }
  initForm() {
    this.sheetSortForm = this.fb.group({
      'sortBy': [`${this.defaultFilter.sortBy}_${this.defaultFilter.sortDirection}`]
    });
  }

  resetForm() {
    this.sheetSortForm = this.fb.group({
      'sortBy': ['date_desc']
    });
  }

  changeSort(e) {
    this.sortBy.setValue(e.target.value);
    this.changedSort.emit({
      sortBy: this.sortBy.value
    });
  }
  
  changeState() {
    this.stateClosed=!this.stateClosed;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

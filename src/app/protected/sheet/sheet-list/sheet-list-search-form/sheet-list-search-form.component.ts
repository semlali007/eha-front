import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MessageService } from 'src/app/core/services/message.service';

@Component({
  selector: 'app-sheet-list-search-form',
  templateUrl: './sheet-list-search-form.component.html',
  styles: [],
})
export class SheetListSearchFormComponent implements OnInit {
  sheetSearchForm: FormGroup;

  @Input() defaultFilter: any;
  @Output() submittedSearchSheets = new EventEmitter<{ searchText: string; searchProvider: string }>();
  @Output() resetted = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
  ) {}

  get searchText() {
    return this.sheetSearchForm.get('searchText');
  }

  get searchProvider() {
    return this.sheetSearchForm.get('searchProvider');
  }

  ngOnInit(): void {
    this.sheetSearchForm = this.fb.group({
      searchText: [this.defaultFilter.search.searchText],
      searchProvider: [this.defaultFilter.search.searchProvider],
    });
  }

  submit(): void {
    this.submittedSearchSheets.emit({
      searchText: this.searchText?.value ?? '',
      searchProvider: this.searchProvider?.value ?? '',
    });
  }

  resetForm(): void {
    this.sheetSearchForm.reset({ searchText: '', searchProvider: '' });
    this.messageService.sendMessage({ initSheetSortBy: true });
    this.resetted.emit();
  }
}

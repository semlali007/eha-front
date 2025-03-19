import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MessageService } from 'src/app/core/services/message.service';
@Component({
  selector: 'app-sheet-list-search-form',
  templateUrl: './sheet-list-search-form.component.html',
  styles: [
  ]
})

export class SheetListSearchFormComponent implements OnInit {
  sheetSearchForm: FormGroup;
  @Input() defaultFilter : any;
  @Output() submittedSearchSheets = new EventEmitter<Object>();
  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
  ) {
  }

  get searchProvider() { return this.sheetSearchForm.get('searchProvider') }
  get searchText() { return this.sheetSearchForm.get('searchText') }

  ngOnInit(): void {
    this.createSheetSearchForm();
  }

  createSheetSearchForm(): FormGroup {
    return this.sheetSearchForm = this.fb.group({
      'searchText': [this.defaultFilter.search.searchText],
      'searchProvider': [this.defaultFilter.search.searchProvider],
    });
  }

  submit(): void {

    this.messageService.sendMessage({
      initSheetFilter: true
    });

    this.messageService.sendMessage({
      initSheetSortBy: true
    });

    let filter = {
      searchText: this.searchText.value,
      searchProvider : this.searchProvider.value
    }
    
    this.submittedSearchSheets.emit(filter);
  }
  resetForm(): void {

    this.messageService.sendMessage({
      initSheetFilter: true
    });

    this.messageService.sendMessage({
      initSheetSortBy: true
    });

    let filter = {
      searchText: '',
      searchProvider : ''
    }
    this.sheetSearchForm.reset();
    this.submittedSearchSheets.emit(filter);
  }
  
}

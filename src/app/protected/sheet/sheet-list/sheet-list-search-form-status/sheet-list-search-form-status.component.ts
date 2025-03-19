import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Status } from 'src/app/shared/models/status';

@Component({
  selector: 'app-sheet-list-search-form-status',
  templateUrl: './sheet-list-search-form-status.component.html',
  styles: [
  ]
})

export class SheetListSearchFormStatusComponent implements OnInit {
  statusList: any;
  @Input() status: FormControl;
  constructor() { }

  ngOnInit(): void {
    this.statusList = (new Status).getStatusList();
  }

}

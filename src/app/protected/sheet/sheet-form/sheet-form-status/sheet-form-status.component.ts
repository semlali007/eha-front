import { Component, OnInit, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Status } from 'src/app/shared/models/status';

@Component({
  selector: 'app-sheet-form-status',
  templateUrl: './sheet-form-status.component.html',
  styles: [
  ]
})
export class SheetFormStatusComponent implements OnInit {
  @Input() status: any;
  statusList:any ;
  
  @Input() sheetForm: FormGroup;
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.statusList = (new Status).getStatusList();
  
  }

}

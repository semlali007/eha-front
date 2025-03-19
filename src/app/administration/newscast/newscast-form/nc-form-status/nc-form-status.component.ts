import { Component, OnInit, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Status } from 'src/app/shared/models/status';
import { NewsCastService } from 'src/app/core/services/newscast.service';
@Component({
  selector: 'app-nc-form-status',
  templateUrl: './nc-form-status.component.html',
  styles: [
  ]
})
export class NcFormStatusComponent implements OnInit {
  @Input() status: any;
  statusList: any;

  @Input() sheetForm: FormGroup;
  constructor(private fb: FormBuilder, private newsCastService: NewsCastService) { }

  ngOnInit(): void {
    this.statusList = this.newsCastService.getStatusList();
  }

}

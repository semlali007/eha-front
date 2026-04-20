import { Component, OnInit, EventEmitter, ViewEncapsulation } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SearchLogService } from 'src/app/core/services/search-log.service';

@Component({
  selector: 'app-associated-form',
  templateUrl: './associated-form.component.html',
  styleUrls: [
    '../../admin-shared.css',
    './associated-form.component.css',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class AssociatedFormComponent implements OnInit {

  factsheetAddForm!: FormGroup;
  public afterAdd: EventEmitter<any> = new EventEmitter();
  id!: number;
  label!: string;

  get title() { return this.factsheetAddForm.get('title'); }

  constructor(
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private searchLogService: SearchLogService,
  ) {}

  ngOnInit(): void {
    this.factsheetAddForm = this.fb.group({
      title: [this.id ? this.label : '', [Validators.required]],
    });
  }

  submit(): void {
    const params: any = {
      id: this.id,
      title: this.title?.value,
    };
    if (!!this.id) {
      params.id = this.id;
      this.searchLogService.updateAssociated(params).subscribe(response => {
        this.bsModalRef.hide();
        this.afterAdd.emit(response);
      });
    } else {
      this.searchLogService.addAssociated(params).subscribe(response => {
        this.bsModalRef.hide();
        this.afterAdd.emit(response);
      });
    }
  }
}

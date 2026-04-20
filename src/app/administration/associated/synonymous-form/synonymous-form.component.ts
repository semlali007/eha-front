import { Component, OnInit, EventEmitter, ViewEncapsulation } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SearchLogService } from 'src/app/core/services/search-log.service';

@Component({
  selector: 'app-synonymous-form',
  templateUrl: './synonymous-form.component.html',
  styleUrls: [
    '../../admin-shared.css',
    './synonymous-form.component.css',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class SynonymousFormComponent implements OnInit {

  factsheetAddForm!: FormGroup;
  public afterAdd: EventEmitter<any> = new EventEmitter();
  id!: number;

  get title() { return this.factsheetAddForm.get('title'); }

  constructor(
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private searchLogService: SearchLogService,
  ) {}

  ngOnInit(): void {
    this.factsheetAddForm = this.fb.group({
      title: ['', [Validators.required]],
    });
  }

  submit(): void {
    const params: any = {
      id: this.id,
      title: this.title?.value,
    };
    this.searchLogService.addSynonymous(params).subscribe(response => {
      this.bsModalRef.hide();
      this.afterAdd.emit(response);
    });
  }
}

import { Component, OnInit, EventEmitter, ViewEncapsulation } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HotlineEmailService } from 'src/app/core/services/hotline-email.service';
import { HotlineGroupService } from 'src/app/core/services/hotline-group.service';

@Component({
  selector: 'app-hotline-email-form',
  templateUrl: './hotline-email-form.component.html',
  styleUrls: [
    './hotline-email-form.component.css',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class HotlineEmailFormComponent implements OnInit {

  factsheetAddForm!: FormGroup;
  public afterAdd: EventEmitter<any> = new EventEmitter();
  id!: number;
  groups: any[] = [];

  get group() { return this.factsheetAddForm.get('group'); }
  get category() { return this.factsheetAddForm.get('category'); }
  get email() { return this.factsheetAddForm.get('email') as any; }
  get living() { return this.factsheetAddForm.get('living'); }

  constructor(
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private hotlineEmailService: HotlineEmailService,
    private hotlineGroupService: HotlineGroupService,
  ) {}

  ngOnInit(): void {
    this.factsheetAddForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      group: ['', [Validators.required]],
      category: ['', [Validators.required]],
      living: [false],
    });
    this.hotlineGroupService.getList({}).subscribe((response: any) => {
      this.groups = Array.isArray(response?.rows) ? response.rows : [];
    });
  }

  submit(): void {
    const params: any = {
      id: this.id,
      email: this.email?.value,
      living: this.living?.value,
      group: this.group?.value,
      category: this.category?.value,
    };
    if (!!this.id) {
      params.id = this.id;
      this.hotlineEmailService.update(params).subscribe(response => {
        this.bsModalRef.hide();
        this.afterAdd.emit(response);
      });
    } else {
      this.hotlineEmailService.add(params).subscribe(response => {
        this.bsModalRef.hide();
        this.afterAdd.emit(response);
      });
    }
  }
}

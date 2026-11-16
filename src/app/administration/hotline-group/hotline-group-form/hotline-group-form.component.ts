import { Component, OnInit, EventEmitter, ViewEncapsulation } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HotlineGroupService } from 'src/app/core/services/hotline-group.service';

@Component({
  selector: 'app-hotline-group-form',
  templateUrl: './hotline-group-form.component.html',
  styleUrls: [
    './hotline-group-form.component.css',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class HotlineGroupFormComponent implements OnInit {

  factsheetAddForm!: FormGroup;
  public afterAdd: EventEmitter<any> = new EventEmitter();
  id!: string;

  get label() { return this.factsheetAddForm.get('label'); }
  get living() { return this.factsheetAddForm.get('living'); }

  constructor(
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private hotlineGroupService: HotlineGroupService,
  ) {}

  ngOnInit(): void {
    this.factsheetAddForm = this.fb.group({
      label: ['', [Validators.required]],
      living: [false],
    });
    if (!!this.id) {
      this.hotlineGroupService.getElement({ id: this.id }).subscribe(response => {
        this.factsheetAddForm = this.fb.group({
          label: [response.label, [Validators.required]],
          living: [!!response.living],
        });
      });
    }
  }

  submit(): void {
    const params: any = {
      id: this.id,
      label: this.label?.value,
      living: this.living?.value,
    };
    if (!!this.id) {
      params.id = this.id;
      this.hotlineGroupService.update(params).subscribe(response => {
        this.bsModalRef.hide();
        this.afterAdd.emit(response);
      });
    } else {
      this.hotlineGroupService.add(params).subscribe(response => {
        this.bsModalRef.hide();
        this.afterAdd.emit(response);
      });
    }
  }
}

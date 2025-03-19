import { Component,  EventEmitter, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HotlineEmailService } from 'src/app/core/services/hotline-email.service';
@Component({
  selector: 'app-hotline-email-edit-forward',
  templateUrl: './hotline-email-edit.component.html',
  styles: [
  ]
})
export class HotlineEmailEditComponent implements OnInit {
  id: string = '';
  actualEmail: string = '';
  editForm: FormGroup;
  public afterEdit: EventEmitter<any> = new EventEmitter();
  constructor(
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private hotlineEmailService: HotlineEmailService,
  ) { }
  get email() { return this.editForm.get('email') }
  ngOnInit(): void {
    this.editForm = this.fb.group({
      'email': [this.actualEmail, [
        Validators.required, Validators.email
      ]]
    });
  }

  submit(): void {
    const params = {
      id: this.id,
      email : this.email.value.trim()
    }
    this.hotlineEmailService.edit(params).subscribe(response => {
      this.bsModalRef.hide();
      this.afterEdit.emit(response);
    })
  }
}

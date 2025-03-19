import { Component, EventEmitter, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HotlineService } from 'src/app/core/services/hotline.service';
@Component({
  selector: 'app-hotline-list-email',
  templateUrl: './hotline-list-email.component.html',
  styles: [
  ]
})
export class HotlineListEmailComponent implements OnInit {
  actualEmail: string = '';
  editForm: FormGroup;
  public afterEdit: EventEmitter<any> = new EventEmitter();
  constructor(
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private hotlineService: HotlineService,
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
      email: this.email.value.trim()
    }
    
    this.bsModalRef.hide();
    this.afterEdit.emit(
      params
    );
  }
}

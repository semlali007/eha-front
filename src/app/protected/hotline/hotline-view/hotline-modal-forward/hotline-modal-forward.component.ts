import { Component,  EventEmitter, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HotlineService } from 'src/app/core/services/hotline.service';
@Component({
  selector: 'app-hotline-modal-forward',
  templateUrl: './hotline-modal-forward.component.html',
  styles: [
  ]
})
export class HotlineModalForwardComponent implements OnInit {
  id: string = '';
  sha: string = '';
  hotlineForwardForm: FormGroup;
  public forwardEvent: EventEmitter<any> = new EventEmitter();
  constructor(
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private hotlineService: HotlineService,
  ) { }
  get email() { return this.hotlineForwardForm.get('email') }
  get emailcc() { return this.hotlineForwardForm.get('emailcc') }
  get commentaire() { return this.hotlineForwardForm.get('commentaire'); }
  ngOnInit(): void {
    this.hotlineForwardForm = this.fb.group({
      'email': ['', [
        Validators.required, Validators.email
      ]],
      'emailcc': ['', [
        Validators.email
      ]],
      'commentaire': ['']
    });
  }

  submit(): void {
    const params = {
      id: this.id,
      sha: this.sha,
      email : this.email.value.trim(),
      emailcc : this.emailcc.value.trim(),
      commentaire: this.commentaire.value.trim()
    }
    this.hotlineService.forward(params).subscribe(response => {
      this.bsModalRef.hide();
      this.forwardEvent.emit(response);
    })
  }
}

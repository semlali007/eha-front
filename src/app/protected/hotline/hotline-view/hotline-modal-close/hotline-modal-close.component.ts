import { Component, Input, EventEmitter, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HotlineService } from 'src/app/core/services/hotline.service';

@Component({
  selector: 'app-hotline-modal-close',
  templateUrl: './hotline-modal-close.component.html',
  styles: [
  ]
})
export class HotlineModalCloseComponent implements OnInit {
  id: string = '';
  sha: string = '';
  closeForm: FormGroup;
  public closeEvent: EventEmitter<any> = new EventEmitter();
  constructor(
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private hotlineService: HotlineService,
  ) { }
  get message() { return this.closeForm.get('message') }
  get note() { return this.closeForm.get('note') }
  ngOnInit(): void {
    this.closeForm = this.fb.group({
      'message': [''],
      'note': [''] 
      // 'note': ['', [
      //   Validators.required
      // ]]
    });
  }

  submit(): void {
    const params = {
      id: this.id,
      sha: this.sha,
      note: this.note.value.trim(),
      feedback: this.message.value,
    }

    this.hotlineService.close(params).subscribe(response => {
      this.bsModalRef.hide();
      this.closeEvent.emit(response);
    })
  }

}

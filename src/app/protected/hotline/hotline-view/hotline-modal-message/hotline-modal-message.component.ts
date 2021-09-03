import { Component, Input, EventEmitter, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MinWordCountValidator } from 'src/app/shared/validators/min-word-count.validator';
import { HotlineService } from 'src/app/core/services/hotline.service';
@Component({
  selector: 'app-hotline-modal-message',
  templateUrl: './hotline-modal-message.component.html',
  styles: [
  ]
})
export class HotlineModalMessageComponent implements OnInit {
  id: string = '';
  sha: string = '';
  hotlineMessageForm: FormGroup;
  public postMessageEvent: EventEmitter<any> = new EventEmitter();
  warning: string = "Vous êtes responsable du contenu que vous fournissez, y compris de la conformité aux lois, règles et réglementations en vigueur. Vous ne devez fournir un contenu que dans la mesure où cela ne vous gêne pas de le partager avec d’autres et qu'il ne puisse porter préjudice à d'autres.";
  constructor(
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private hotlineService: HotlineService,
  ) { }
  get message() { return this.hotlineMessageForm.get('message') }
  ngOnInit(): void {
    this.hotlineMessageForm = this.fb.group({
      'message': ['', [
        Validators.required, MinWordCountValidator(5)
      ]]
    });
  }

  submit(): void {
    const params = {
      id: this.id,
      sha: this.sha,
      post: this.message.value
    }

    this.hotlineService.postMessage(params).subscribe(response => {
      this.bsModalRef.hide();
      this.postMessageEvent.emit(response);
    })
  }
}

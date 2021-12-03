import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalService } from 'src/app/core/services/modal.service';
import { Observable } from 'rxjs';
import { Error } from 'src/app/shared/models/error';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modal-info',
  templateUrl: './modal-info.component.html',
  styleUrls: ['./modal-info.component.css']
})
export class ModalInfoComponent implements OnInit {
  //@ViewChild('autoShownModal', { static: false }) autoShownModal?: ModalDirective;
  public error$: Observable<Error | null>;
  constructor(private modalService: ModalService) { }
  ngOnInit() {
    this.error$ = this.modalService.error$;
  }
  hideModal() {
    this.modalService.closeModal();
  }
  onHidden(): void {
    this.modalService.closeModal();
  }
}

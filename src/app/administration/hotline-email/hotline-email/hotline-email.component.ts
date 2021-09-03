import { Component, OnInit } from '@angular/core';
import { HotlineEmailService } from 'src/app/core/services/hotline-email.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { HotlineEmailEditComponent } from '../hotline-email-edit/hotline-email-edit.component';

@Component({
  selector: 'app-hotline-email',
  templateUrl: './hotline-email.component.html',
  styleUrls: ['./hotline-email.component.css']
})
export class HotlineEmailComponent implements OnInit {
  emails: any = [];
  bsModalRef: BsModalRef;
  constructor(
    private hotlineEmailService: HotlineEmailService,
    private modalService: BsModalService
  ) { }

  ngOnInit(): void {
    this.getList();
  }


  getList() {
    this.emails = [];
    this.hotlineEmailService
      .getList({})
      .subscribe(response => {
        this.emails = response.rows;
      })
  }

  update(item) {
    this.hotlineEmailService
      .update({ id: item.id })
      .subscribe(response => {
        this.getList();
      })
  }


  openEdit(email) {
    const initialState = {
      id: email.id,
      actualEmail: email.email
    };

    this.bsModalRef = this.modalService.show(HotlineEmailEditComponent, { initialState });
    this.bsModalRef.content.closeBtnName = 'Fermer';
    this.bsModalRef.content.afterEdit.subscribe(response => {
      this.getList();
    });
  }
}

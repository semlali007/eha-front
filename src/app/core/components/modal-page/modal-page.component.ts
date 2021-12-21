import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'modal-page',
  templateUrl: './modal-page.component.html',
})
 
export class ModalPageComponent implements OnInit {
  title?: string;
  page?: any;
  closeBtnName?: string;
  list: any[] = [];
 
  constructor(public bsModalRef: BsModalRef) {}
 
  ngOnInit() {
    this.list.push('PROFIT!!!');
  }
}
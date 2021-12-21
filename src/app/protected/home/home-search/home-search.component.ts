import { Component, OnInit } from '@angular/core';
import { ModalPageComponent } from 'src/app/core/components/modal-page/modal-page.component';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { PageService } from 'src/app/core/services/page.service';

@Component({
  selector: 'app-home-search',
  templateUrl: './home-search.component.html',
  styleUrls: ['./home-search.component.css']
})
export class HomeSearchComponent implements OnInit {
  bsModalRef?: BsModalRef;
  page: any = {};
  constructor(private pageService: PageService,private modalService: BsModalService) { }

  ngOnInit(): void {
    this.loadPurchasePage();
  }


  loadPurchasePage() {
    this.pageService.getPage({ cache: 'cache' , page:'purchase_modal_news'}).subscribe(data => {
    this.page = data;
    })
  }

  openModalWithComponent() {
    const initialState = {
        title: 'test',
        list:[],
        page: this.page
    };
    this.bsModalRef = this.modalService.show(ModalPageComponent, {initialState});
    this.bsModalRef.content.closeBtnName = 'Close';
  }

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PageService } from 'src/app/core/services/page.service';
import { ModalPageComponent } from 'src/app/core/components/modal-page/modal-page.component';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-home-sheet',
  templateUrl: './home-sheet.component.html',
  styleUrls: ['./home-sheet.component.css']
})
export class HomeSheetComponent implements OnInit {
  bsModalRef?: BsModalRef;
  subscription: Subscription;
  sheetPath ="app/fiches/liste" ;
  page: any = {};

  section: any = [];
  constructor(
    private router: Router,
    private pageService: PageService,
    private modalService: BsModalService

  ) { }

  ngOnInit(): void {
    this.loadSheetPage();
  }


  call(path:any){
    this.router.navigate([path]) ;
  }


  loadSheetPage() {
    this.pageService.getPage({ cache: 'cache' , page:'sheet_modal_news'}).subscribe(data => {
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



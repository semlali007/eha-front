import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DocumentationService } from 'src/app/core/services/documentation.service';
import { PageService } from 'src/app/core/services/page.service';
import { ModalPageComponent } from 'src/app/core/components/modal-page/modal-page.component';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-home-documentation',
  templateUrl: './home-documentation.component.html',
  styleUrls: ['./home-documentation.component.css']
})
export class HomeDocumentationComponent implements OnInit {
  bsModalRef?: BsModalRef;
  subscription: Subscription;
  sheetPath ="app/fiches/liste" ;
  page: any = {};

  section: any = [];
  constructor(
    private router: Router,
    private documentationService: DocumentationService,
    private pageService: PageService,
    private modalService: BsModalService
   
  ) { }

  ngOnInit(): void {
    this.loadDocumentation();
    this.loadSheetPage();
  }

  navigate(doc: any) {
    if (doc.link == '#' || doc.link.length == 0) {
      this.router.navigate(
        [`app/documentation/${doc.id}`]
      );
    } else if (doc.link.includes('http') == true) {
      window.open(doc.link, '_blank');
    } else if (doc.link.includes('mailto') == true) {
      window.open(doc.link, '_self');
    } else {
      this.router.navigate(
        [doc.link]
      );
    }
  }

  call(path:any){
    this.router.navigate([path]) ;
  }

  loadDocumentation() {
    this.section = [];
    this.documentationService.getDocumentation({ cache: 'cache' }).subscribe(data => {
      data.filter(s => s.parent == 0).forEach(element => {
        this.section.push(element);
      });
    })
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

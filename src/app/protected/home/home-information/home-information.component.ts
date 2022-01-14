import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalNewsComponent } from 'src/app/core/components/modal-news/modal-news.component';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { PageService } from 'src/app/core/services/page.service';
import { Observable} from 'rxjs';
import { ConfigService } from 'src/app/core/services/config.service';

@Component({
  selector: 'app-home-information',
  templateUrl: './home-information.component.html',
  styleUrls: ['./home-information.component.css']
})
export class HomeInformationComponent implements OnInit {
  data:any={};
  bsModalRef?: BsModalRef;
  subscription: Subscription;
  list: [];
  constructor(private router: Router,
              private configService: ConfigService,
              private pageService: PageService,
              private modalService: BsModalService,
              
              ) { }

  ngOnInit(): void {
    this.loadInformation();
  }


  loadInformation() {
    this.configService.getNews({ cache: 'cache', type: 'home_page' }).subscribe(data => {
      this.list = data;
    })
    this.pageService.getPage({ cache: 'cache', page: 'home_page' }).subscribe(data => {
      this.data = data;
    })
  }

  navigate(url){
    this.router.navigate(
      [url]
    );
  }
  openModalWithComponent() {
    const initialState = {
        title: 'test',
        list:this.list,
        page: {
          content:this.data.content,
          type: 'home_page',
        },
        checkboxValidation: true
    };
    this.bsModalRef = this.modalService.show(ModalNewsComponent, {initialState});
    this.bsModalRef.content.closeBtnName = 'Close';
  }

}

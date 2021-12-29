import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InformationService } from 'src/app/core/services/information.service';
import { ModalPageComponent } from 'src/app/core/components/modal-page/modal-page.component';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home-information',
  templateUrl: './home-information.component.html',
  styleUrls: ['./home-information.component.css']
})
export class HomeInformationComponent implements OnInit {
  data:any={};
  bsModalRef?: BsModalRef;
  subscription: Subscription;
  constructor(private router: Router,
              private informationService: InformationService,
              private modalService: BsModalService,
              ) { }

  ngOnInit(): void {
    this.loadInformation();
  }


  loadInformation() {
    this.informationService.getInformation({ cache: 'cache' , type:'home_page'}).subscribe(data => {
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
        list:[],
        page: {
          content:this.data.long_description
        }
    };
    this.bsModalRef = this.modalService.show(ModalPageComponent, {initialState});
    this.bsModalRef.content.closeBtnName = 'Close';
  }

}

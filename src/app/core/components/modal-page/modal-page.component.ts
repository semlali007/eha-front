import { SelectorListContext } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { ConfigService } from 'src/app/core/services/config.service';
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
  checkboxValidation?: boolean ;
  isSelected:boolean=false;
 
  constructor(public bsModalRef: BsModalRef, private configService: ConfigService,) {}
 
  ngOnInit() {
    this.list.push('PROFIT!!!');
  }


  onCheckboxAllChange(e) {

      this.isSelected = e.target.checked == true;
  }

  onCheckboxViewed() {
    if(this.isSelected){
      this.configService.createUserNews({type: 'home_page', items: [{id:this.page.id}]}).subscribe(
        (response) => {
          console.log("Données correctement envoyées !\n" + response);
        }
      )
    }
      this.bsModalRef.hide();
  }




}
import { SelectorListContext } from '@angular/compiler';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { ConfigService } from 'src/app/core/services/config.service';
import { Observable} from 'rxjs';
import { UserNews } from 'src/app/shared/models/userNews';
@Component({
  selector: 'modal-news',
  templateUrl: './modal-news.component.html',
})
 
export class ModalNewsComponent implements OnInit {
  title?: string;
  page?: any;
  closeBtnName?: string;
  list:UserNews[] = [];
  checkboxValidation?: boolean ;
  isSelected:boolean=false;
  @ViewChild('f') allCheck: ElementRef;
  constructor(public bsModalRef: BsModalRef, private configService: ConfigService,) {}
 
  ngOnInit() {
  }

  onCheckboxChange(e) {
    this.list.forEach(item => {
      if (e.target.value == item.id) {
        item.isSelected = e.target.checked == true;
      }
    });
    if(this.list.every(v => v.isSelected === true )) {
      this.allCheck.nativeElement.checked = true;
    } else {
      this.allCheck.nativeElement.checked = false;
    }
  }

  onCheckboxViewed() {
    const selected = [];
    this.list.forEach(item => {
      if (item.isSelected == true ) {
        selected.push(item);
      }
    });
    if(selected.length !== 0 ) {
      this.configService.createUserNews({type:'home_page',items:selected}).subscribe(
        (response) => {
          console.log("Données correctement envoyées !\n" + response);
        }
      )
    }
    this.hideModal();
  }
 
  hideModal(): void {
    this.bsModalRef?.hide();
  }
 
  onHidden(): void {
  }

  

}
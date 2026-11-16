import { SelectorListContext } from '@angular/compiler';
import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { ConfigService } from 'src/app/core/services/config.service';
import { Observable} from 'rxjs';
import { Router } from '@angular/router';
import { UserNews } from 'src/app/shared/models/userNews';
import { NotificationService } from 'src/app/core/services/notification.service';
import { NotificationDeletedService } from  'src/app/core/services/notification-deleted.service';
@Component({
  selector: 'modal-notification',
  templateUrl: './modal-notification.component.html',
  styleUrls: ['./modal-notification.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ModalNotificationComponent implements OnInit {
  title?: string;
  userNni?: string;
  page?: any;
  closeBtnName?: string;
  list:UserNews[] = [];
  checkboxValidation?: boolean ;
  isSelected:boolean=false;
  @ViewChild('f') allCheck: ElementRef;
  constructor(
    public bsModalRef: BsModalRef, 
    private configService: ConfigService,
    private notificationService: NotificationService,
    private notificationDeletedService: NotificationDeletedService,
    private router: Router,
    ) {}
 
  ngOnInit() {
  }

  putViewed(id, sheetId) {
      this.notificationService.putViewed(id).subscribe(
        (response) => {
          this.bsModalRef?.hide();
          this.router.navigate([`app/fiches/details/${sheetId}`], { fragment: 'history' });
        }
      )
  }
 
  /**
   * Supprimer un element de tableau 
   */
  delete(element){
    const index: number = this.list.indexOf(element);
    if (index !== -1) {
        this.list.splice(index, 1);
    } 
   this.notificationService.putViewed(element.id).subscribe(() => {
    this.notificationDeletedService.emitNotificationDeleted();
  }) ;
  }

  hideModal(): void {
    this.bsModalRef?.hide();
  }
 
  onHidden(): void {
  }

  deleteAll(){
   this.notificationService.putAllViewed(this.userNni).subscribe(() => {
    this.list = [];
    this.notificationDeletedService.emitNotificationDeleted();
  }) ;
  }

}
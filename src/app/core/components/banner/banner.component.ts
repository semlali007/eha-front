import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/shared/models/user';
import { AuthService } from 'src/app/core/services/auth.service';
import { Subscription } from 'rxjs';
import { NotificationService } from 'src/app/core/services/notification.service';
import { ModalNotificationComponent } from 'src/app/core/components/modal-notification/modal-notification.component';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { ConfigService } from 'src/app/core/services/config.service';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent implements OnInit {
  public isCollapsed = true;
  public notification$: Observable<any|null>;
  homePath = 'app/accueil';
  sheetPath ="app/fiches/liste" ;
  purchasePath ="/app/mes-demandes-achat" ;
  public user: User;
  bsModalRef?: BsModalRef;
  data:any={};
  list: [];
  private subscription: Subscription;
  constructor( 
    private authService: AuthService,
    private router: Router,
    private modalService: BsModalService,
    private configService: ConfigService,
    private notificationService: NotificationService
    ) { }
  ngOnInit() {
    this.notification$ = this.notificationService.notification$;
    this.subscription =
      this.authService.user$.subscribe(user => {
        this.user = user;
      });
  }

   ngOnDestroy() {
    this.subscription.unsubscribe();
   }

  public navigate(page: string): void {
    this.router.navigate([page]);
  }

  public logout() { 
    window.location.href = "/api/saml/logout";
   }

   openModal() {
    this.notificationService.getUserNotification({nni:this.user.nni}).subscribe(data => {
      this.list = data;
      const initialState = {
        title: 'test',
        list: this.list,
        userNni:this.user.nni,
        page: {
          content: this.data.content,
          type: 'home_page',
        },
        checkboxValidation: true
      };
      this.bsModalRef = this.modalService.show(ModalNotificationComponent, { initialState });
      this.bsModalRef.content.closeBtnName = 'Close';
    })
  }

  forceNavigate(name: string) {
    this.router.navigate(['/app/accueil'], { fragment: name });
  }

}

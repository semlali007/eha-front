import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/shared/models/user';
import { AuthService } from 'src/app/core/services/auth.service';
import { Subscription } from 'rxjs';
import { NotificationService } from 'src/app/core/services/notification.service';
import { NotificationDeletedService } from  'src/app/core/services/notification-deleted.service';
import { ModalNotificationComponent } from 'src/app/core/components/modal-notification/modal-notification.component';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { ConfigService } from 'src/app/core/services/config.service';
import { Observable} from 'rxjs';
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
  public numberOfNotifications: number = 0;

  private subscription: Subscription;
  constructor( 
    private authService: AuthService,
    private router: Router,
    private modalService: BsModalService,
    private configService: ConfigService,
    private notificationService: NotificationService,
    private notificationDeletedService: NotificationDeletedService
    ) { }

  ngOnInit() {
    this.notification$ = this.notificationService.notification$;
    this.subscription = 
      this.authService.user$.subscribe(user => {
          this.user = user;
          // Rafraîchir les notifications uniquement après avoir chargé l'utilisateur
          if (this.user && this.user.nni) {
            this.refreshNotifications();
          }
    });

    this.notificationDeletedService.notificationDeleted$.subscribe(() => {
      this.refreshNotifications();
    })
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
    // Vérifier que l'utilisateur est chargé
    if (!this.user || !this.user.nni) {
      console.warn('openModal: user not loaded yet');
      return;
    }
    
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
      this.bsModalRef = this.modalService.show(ModalNotificationComponent, { initialState, class: 'notif-dialog' });
      this.bsModalRef.content.closeBtnName = 'Close';
    })
  }

  forceNavigate(name: string) {
    this.router.navigate(['/app/accueil'], { fragment: name });
  }

  private refreshNotifications() {
    // Vérifier que l'utilisateur est chargé avant d'appeler l'API
    if (!this.user || !this.user.nni) {
      console.warn('refreshNotifications: user or user.nni is not available yet');
      return;
    }
    
    this.notificationService.getUserNotification({ nni: this.user.nni }).subscribe(data => {
      this.list = data;
      if (Array.isArray(data)) {
        this.numberOfNotifications = data.length;
      } else {
        this.numberOfNotifications = 0; 
      }
    });
  }

}

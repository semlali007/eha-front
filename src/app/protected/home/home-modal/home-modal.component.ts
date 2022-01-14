import { Component, ElementRef, OnInit , ViewChild, OnDestroy} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal'; 
import { ConfigService } from 'src/app/core/services/config.service';
import { UserNews } from 'src/app/shared/models/userNews';
import { MessageService } from 'src/app/core/services/message.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home-modal',
  templateUrl: './home-modal.component.html',
  styleUrls: ['./home-modal.component.css']
})
export class HomeModalComponent implements OnInit, OnDestroy {

  constructor(private configService: ConfigService,
              private messageService: MessageService
  ) { }

  @ViewChild('autoShownModal', { static: false }) autoShownModal?: ModalDirective;
  @ViewChild('f') allCheck: ElementRef;
  isViewed:boolean;
  isModalShown:boolean;
  infos:UserNews[] = [];
  checkedTable:UserNews[] = [];
  subscriptionViewed: Subscription;
  subscriptionMessage: Subscription;


  ngOnInit(): void {
    this.subscriptionMessage = this.messageService.getMessage().subscribe(
      (data) => {
        if (!!data && !!data.modalStateHome && (data.modalStateHome == true)) {
          this.subscriptionViewed = this.configService.isViewed$.subscribe(
            isViewed => {
              this.isViewed = isViewed;
              console.log('this.isViewed', this.isViewed);
              if (!this.isViewed) {
                this.configService.getNews({ type: 'after_connexion' }).subscribe(
                (response) => {
                  this.isModalShown = response.length > 0;
                  this.infos = response;
                }
              );
            }
        }); 
        }
      }
    );
  }

  ngOnDestroy() {
    if (this.subscriptionViewed) {
      this.subscriptionViewed.unsubscribe();
    }

    if (this.subscriptionMessage) {
      this.subscriptionMessage.unsubscribe();
    }
  }

  onCheckboxAllChange(e) {
    this.infos.forEach(item => {
      item.isSelected = e.target.checked == true;
    })
  }

  onCheckboxChange(e) {
    this.infos.forEach(item => {
      if (e.target.value == item.id) {
        item.isSelected = e.target.checked == true;
      }
    });
    if(this.infos.every(v => v.isSelected === true )) {
      this.allCheck.nativeElement.checked = true;
    } else {
      this.allCheck.nativeElement.checked = false;
    }
  }

  onCheckboxViewed() {
    const selected = [];
    this.infos.forEach(item => {
      if (item.isSelected == true ) {
        selected.push(item);
      }
    });
    if(selected.length !== 0 ) {
      this.configService.createUserNews({type:'news',items:selected}).subscribe(
        (response) => {
          console.log("Données correctement envoyées !\n" + response);
        }
      )
    }
    this.hideModal();
  }
 
  hideModal(): void {
    this.configService.tagModalViewed(true);
    this.autoShownModal?.hide();
  }
 
  onHidden(): void {
    this.isModalShown = false;
  }
}

import { Component, ElementRef, OnInit , ViewChild} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal'; 
import { ConfigService } from 'src/app/core/services/config.service';
import { UserNews } from 'src/app/shared/models/userNews';

@Component({
  selector: 'app-home-modal',
  templateUrl: './home-modal.component.html',
  styleUrls: ['./home-modal.component.css']
})
export class HomeModalComponent implements OnInit {

  constructor(private configService: ConfigService) { }


  @ViewChild('autoShownModal', { static: false }) autoShownModal?: ModalDirective;

  @ViewChild('f') allCheck: ElementRef;
  viewed:boolean;
  isModalShown:boolean;
  infos:UserNews[] = [];
  checkedTable:UserNews[] = [];

  ngOnInit(): void {
    console.log(this.infos);
    this.configService.getNews().subscribe(
      (response) => {
        this.isModalShown = response.length > 0;
        this.infos = response;
        console.log(response);
      }
    );
    console.log(this.infos);
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
    this.configService.postChecks(selected).subscribe(
      (response) => {
        console.log("Données correctement envoyées !\n" + response);
      }
    )
    this.hideModal();
  }
 
  hideModal(): void {
    this.autoShownModal?.hide();
  }
 
  onHidden(): void {
    this.isModalShown = false;
  }

}

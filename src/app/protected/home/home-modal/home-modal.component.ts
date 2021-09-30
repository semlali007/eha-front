import { Component, OnInit , ViewChild} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal'; 
import { ConfigService } from 'src/app/core/services/config.service';

@Component({
  selector: 'app-home-modal',
  templateUrl: './home-modal.component.html',
  styleUrls: ['./home-modal.component.css']
})
export class HomeModalComponent implements OnInit {

  constructor(private configService: ConfigService) { }


  @ViewChild('autoShownModal', { static: false }) autoShownModal?: ModalDirective;

  isModalShown:boolean;
  infos:any[] = [];

  ngOnInit(): void {
    this.configService.getNews().subscribe(
      (response) => {
        this.isModalShown = !response.viewed;
        this.infos = response.infos;
      }
    );
  }


  // Visualiser les news
  // showModal(): boolean {
  //   this.isModalShown = true;
  //   return this.isModalShown;
  // }
 
  hideModal(): void {
    this.autoShownModal?.hide();
  }
 
  onHidden(): void {
    this.isModalShown = false;
  }

}

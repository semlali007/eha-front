import { Component, OnInit , ViewChild} from '@angular/core';
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

  viewed:boolean;
  isModalShown:boolean;
  infos:any[] = [];
  checkedTable:UserNews[] = [];

  ngOnInit(): void {
    this.configService.getNews().subscribe(
      (response) => {
        this.isModalShown = response.length > 0;
        this.infos = response;
        console.log(response);
      }
    );
  }

  // Visualiser les news
  // showModal(): boolean {
  //   this.isModalShown = true;
  //   return this.isModalShown;
  // }

  check(i:any,f:any) {
    if(f.target.checked) {
      this.checkedTable.push(i);
    } else {
      this.checkedTable.forEach(
        (element,index) => {  
          if(i.id == element.id) {
            this.checkedTable.splice(index, 1);
          }
        }
      )
    }
    console.log(this.checkedTable);
  }

  checkAll(f:any) {
    if(f.target.checked) {
      this.infos.forEach(
        (element) => {  
          this.checkedTable.push(element);
        }
      )
    } else {
      this.checkedTable = [];
    }
    console.log(this.checkedTable);
  }

  checkingCheck(val:UserNews[]) {
    this.configService.postChecks(val).subscribe(
      (response) => {
        console.log(response);
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

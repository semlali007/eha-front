import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PageService } from 'src/app/core/services/page.service';
import { ModalPageComponent } from 'src/app/core/components/modal-page/modal-page.component';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { ViewModeService } from 'src/app/core/services/view-mode.service';

@Component({
  selector: 'app-home-contrat-groupe',
  templateUrl: './home-contrat-groupe.component.html',
  styleUrls: ['./home-contrat-groupe.component.css']
})
export class homeContratGroupeComponent implements OnInit {
  bsModalRef?: BsModalRef;
  subscription: Subscription;
  page: any = {};

  section: any = [];
  constructor(
    private pageService: PageService,
    private modalService: BsModalService,
    private router: Router,
    private viewModeService: ViewModeService
  ) { }

  ngOnInit(): void {
    this.loadSheetPage();
  }


  loadSheetPage() {
    this.pageService.getPage({ cache: 'cache' , page:'sheet_modal_news'}).subscribe(data => {
      this.page = data;
    })
  }
  /**
   * Active le mode contrat groupe et redirige vers la liste des fiches
   */
  consultezContratsGroupe(): void {
    this.viewModeService.setContratGroupeMode();
    this.router.navigate(['/app/fiches/liste']);
  }

  /**
   * Active le mode normal et redirige vers la liste des fiches
   */
  accederVitrineOffre(): void {
    this.viewModeService.setNormalMode();
    this.router.navigate(['/app/fiches/liste']);
  }

}



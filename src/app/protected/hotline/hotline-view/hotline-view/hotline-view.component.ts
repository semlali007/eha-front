import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HotlineService } from 'src/app/core/services/hotline.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { HotlineModalCloseComponent } from '../hotline-modal-close/hotline-modal-close.component';
import { HotlineModalFileComponent } from '../hotline-modal-file/hotline-modal-file.component';
import { HotlineModalForwardComponent } from '../hotline-modal-forward/hotline-modal-forward.component';
import { HotlineModalMessageComponent } from '../hotline-modal-message/hotline-modal-message.component';
import { FileService } from 'src/app/core/services/file.service';
import * as fileSaver from 'file-saver';
import { User } from 'src/app/shared/models/user';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-hotline-view',
  templateUrl: './hotline-view.component.html',
  styles: [
  ]
})
export class HotlineViewComponent implements OnInit {
  public hotlineId: string = '';
  public hotline: any = {};
  public sha: string = '';
  public isHotliner: boolean = false;
  public isRequester: boolean = false;
  public informations: any = {};
  public timeline: any = {};
  public warningMessage: string = '';
  bsModalRef: BsModalRef;
  public subscription: Subscription;
  public user: User;

  constructor(
    private route: ActivatedRoute,
    private hotlineService: HotlineService,
    private router: Router,
    private modalService: BsModalService,
    private fileService: FileService,
    private authService: AuthService,

  ) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (!!params.id) {
        this.hotlineId = params.id;
        if (!!params.sha) {
          this.sha = params.sha;
        }
        this.loadHotline();
      }
    });

   
  }

  initHotline(hotline: any) {
    this.isRequester = hotline.isRequester;
    this.isHotliner = hotline.isHotliner;
    this.informations = hotline.info;
    this.timeline = hotline.timeline;
    this.subscription = this.authService.user$.subscribe(user => this.user = user);
  }

  showList(step) {
    this.router.navigate(['app/hotline/list'], { queryParams: { step: step } });
  }

  openPostMessage() {
    const initialState = {
      id: this.hotlineId,
      sha: this.sha
    };

    this.bsModalRef = this.modalService.show(HotlineModalMessageComponent, { initialState });
    this.bsModalRef.content.closeBtnName = 'Fermer';
    this.bsModalRef.content.postMessageEvent.subscribe(response => {
      if (!!response && !!response.message) {
        this.warningMessage = response.message;
      }
      
      this.loadHotline();
    });
  }

  loadHotline() {
    this.hotlineService.getHotline({
      id: this.hotlineId,
      sha: this.sha
    }).subscribe(hotline => {
      if (!hotline) return;
      this.initHotline(hotline);
    });
  }

  reload() {
    this.loadHotline();
  }


  openForward() {
    const initialState = {
      id: this.hotlineId,
      sha: this.sha
    };
    this.bsModalRef = this.modalService.show(HotlineModalForwardComponent, { initialState });
    this.bsModalRef.content.closeBtnName = 'Fermer';
    this.bsModalRef.content.forwardEvent.subscribe(response => {
      if (!!response && !!response.message) {
        this.warningMessage = response.message;
      }
      this.loadHotline();
    });
  }
  openAddFile() {
    const initialState = {
      id: this.hotlineId,
      sha: this.sha
    };
    this.bsModalRef = this.modalService.show(HotlineModalFileComponent, { initialState });
    this.bsModalRef.content.closeBtnName = 'Fermer';
    this.bsModalRef.content.fileEvent.subscribe(response => {
      if (!!response && !!response.message) {
        this.warningMessage = response.message;
      }
      this.loadHotline();
    });
  }

  openCloseHotline(){
    const initialState = {
      id: this.hotlineId,
      sha: this.sha
    };
    this.bsModalRef = this.modalService.show(HotlineModalCloseComponent, { initialState });
    this.bsModalRef.content.closeBtnName = 'Fermer';
    this.bsModalRef.content.closeEvent.subscribe(response => {
      if (!!response && !!response.message) {
        this.warningMessage = response.message;
      }
      this.loadHotline();
    });
  }

  downloadFile(file){
    this.fileService.sheetDocument({ url: file }).subscribe((response: any) => {
      let blob: any = new Blob([response]);
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob, file);
      }
      else {
        const url = window.URL.createObjectURL(blob);
        fileSaver.saveAs(blob, file);
      };
    });
  }

  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe();
  }
  
}

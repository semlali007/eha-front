import { Component, EventEmitter, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HotlineService } from 'src/app/core/services/hotline.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { HotlineModalFileComponent } from '../hotline-modal-file/hotline-modal-file.component';
import { HotlineModalForwardComponent } from '../hotline-modal-forward/hotline-modal-forward.component';
import { FileService } from 'src/app/core/services/file.service';
import * as fileSaver from 'file-saver';
import { User } from 'src/app/shared/models/user';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { MinWordCountValidator } from 'src/app/shared/validators/min-word-count.validator';

@Component({
  selector: 'app-hotline-view',
  templateUrl: './hotline-view.component.html',
  styleUrls: ['./hotline-view.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class HotlineViewComponent implements OnInit, OnDestroy {
  public hotlineId: string = '';
  public hotline: any = {};
  public sha: string = '';
  public isHotliner: boolean = false;
  public isRequester: boolean = false;
  public isCurrentFowarded: string = '';
  public informations: any = {};
  public timeline: any[] = [];
  public warningMessage: string = '';
  public isDiscussionClosed: boolean = false;
  bsModalRef: BsModalRef;
  public subscription: Subscription;
  public user: User;
  public closeEvent: EventEmitter<any> = new EventEmitter();

  public composerForm: FormGroup;
  get composerMessage() { return this.composerForm?.get('message') as any; }

  constructor(
    private route: ActivatedRoute,
    private hotlineService: HotlineService,
    private router: Router,
    private modalService: BsModalService,
    private fileService: FileService,
    private authService: AuthService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.composerForm = this.fb.group({
      message: ['', [Validators.required, MinWordCountValidator(5)]],
    });
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
    this.isCurrentFowarded = hotline.current_forward;
    this.informations = hotline.info;
    this.timeline = hotline.timeline;
    this.isDiscussionClosed = this.informations?.step === 'end';
    this.subscription = this.authService.user$.subscribe(user => this.user = user);
  }

  /** Détermine si un message a été posté par la personne qui consulte. */
  isMine(row: any): boolean {
    if (!row) return false;
    if (this.isRequester && !row.is_hotline) return true;
    if (this.isHotliner && row.is_hotline) return true;
    return false;
  }

  /** Initiales pour l'avatar à partir d'un email. */
  userInitials(email?: string): string {
    if (!email) return '?';
    const local = email.split('@')[0] || email;
    const parts = local.split(/[._-]/).filter(p => p.length > 0);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return local.substring(0, 2).toUpperCase();
  }

  statusLabel(step: string): string {
    if (step === 'end') return 'Fermée';
    if (step === 'progress') return 'En cours';
    return 'Nouvelle';
  }

  get canPost(): boolean {
    if (this.isDiscussionClosed) return false;
    return this.isRequester || this.isHotliner || (this.isCurrentFowarded === this.user?.email);
  }

  get canClose(): boolean {
    if (this.isDiscussionClosed) return false;
    if (this.informations?.step === 'end') return false;
    return this.isRequester
        || (!!this.user && (this.user.hasRole('EHA_GESTIONNAIRE') || this.user.hasRole('EHA_ADMIN')))
        || this.isCurrentFowarded === this.user?.email;
  }

  showList(step: string) {
    this.router.navigate(['app/hotline/list'], { queryParams: { step: step } });
  }

  /** Envoi rapide depuis le composer en bas de page. */
  sendQuickMessage(): void {
    if (!this.composerForm?.valid) return;
    const params = {
      id: this.hotlineId,
      sha: this.sha,
      post: this.composerMessage.value,
    };
    this.hotlineService.postMessage(params).subscribe(response => {
      if (!!response && !!response.message) {
        this.warningMessage = response.message;
      }
      this.composerForm.reset({ message: '' });
      this.loadHotline();
    });
  }

  /** Cmd/Ctrl+Enter envoie ; Enter seul fait un retour à la ligne. */
  onComposerEnter(event: any): void {
    if (event.ctrlKey || event.metaKey) {
      event.preventDefault();
      this.sendQuickMessage();
    }
  }

  loadHotline() {
    this.hotlineService.getHotline({
      id: this.hotlineId,
      sha: this.sha,
    }).subscribe(hotline => {
      if (!hotline) return;
      this.initHotline(hotline);
    });
  }

  openForward() {
    const initialState = {
      id: this.hotlineId,
      sha: this.sha,
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
      sha: this.sha,
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

  openCloseHotline() {
    this.submit(this.hotlineId, this.sha);
  }

  submit(id: string, sha: string): void {
    const params = { id, sha };
    this.hotlineService.close(params).subscribe(response => {
      if (!!response && !!response.message) {
        this.warningMessage = response.message;
      }
      this.isDiscussionClosed = true;
      this.loadHotline();
    });
  }

  /** Conservé pour rétrocompatibilité (le composer remplace la modal en usage standard). */
  openPostMessage(): void {
    // No-op: le composer in-page gère le post de message.
  }

  downloadFile(file: string) {
    this.fileService.sheetDocument({ url: file }).subscribe((response: any) => {
      let blob: any = new Blob([response]);
      if (window.navigator && (window.navigator as any).msSaveOrOpenBlob) {
        (window.navigator as any).msSaveOrOpenBlob(blob, file);
      } else {
        const url = window.URL.createObjectURL(blob);
        fileSaver.saveAs(blob, file);
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }
}

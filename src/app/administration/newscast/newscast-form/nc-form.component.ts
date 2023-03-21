import { Component, OnInit, TemplateRef, OnDestroy, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { UploaderService } from 'src/app/core/services/uploader.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';
import { DateService } from 'src/app/core/services/date.service';
import { Document } from 'src/app/shared/models/document';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { User } from 'src/app/shared/models/user';
import { Subscription } from 'rxjs';
import { NewsCastService } from 'src/app/core/services/newscast.service';
import { ContractService } from 'src/app/core/services/contract.service';

@Component({
  selector: 'app-nc-form',
  templateUrl: './nc-form.component.html',
  styles: [
  ]
})

export class NcFormComponent implements OnInit, OnDestroy{
  newsId: string;
  ncForm: FormGroup;
  kitUploader: FileUploader;
  privateUploader: FileUploader;
  privateEnedisUploader: FileUploader;
  privateEdfEnedisUploader: FileUploader;
  bsModalRef?: BsModalRef;
  bsConfirmModalRef?: BsModalRef;
  bsDraftModalRef?: BsModalRef;
  private deletedFiles: Document[];
  public user: User;
  public subscription: Subscription;
  fromNetAchat:boolean=false;





  constructor(private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private uploaderService: UploaderService,
    private route: ActivatedRoute,
    private dateService: DateService,
    private modalService: BsModalService,
    private contractService: ContractService,
    private newsCastService: NewsCastService
  ) {
  }

  ngOnInit() {
    this.subscription = this.authService.user$.subscribe(user => this.user = user);
    this.init();
  
  }

  get title() { return this.ncForm.get('title') }
  get long_description() { return this.ncForm.get('long_description') }
  get short_description() { return this.ncForm.get('short_description') }
  get categoryId() { return this.ncForm.get('categoryId') as any; }
  get status() { return this.ncForm.get('status') as any; }
  get is_home() { return this.ncForm.get('is_home') }
  resetSheetForm() {
    this.ncForm.reset();
  }

  init() {
    this.newsId = '';

    this.ncForm = this.createForm();
    this.route.params.subscribe(params => {
      if (params.id) {
        this.newsId = params.id;
        this.newsCastService.get(params.id).subscribe(data => {
          this.resetSheetForm();
          if (!data) return;
          this.initEditForm(data);
        });
      }else{
      }
    });
  }

  cancel() {
    this.router.navigate(['/admin/actualites']);
  }

  createForm(): FormGroup {
    return this.ncForm = this.fb.group({
      'title': ['', [
        Validators.required,
        Validators.minLength(4),
      ]],
      'long_description': '',
      'short_description': [''],
      'categoryId': 0,
      'status': 0,
      'is_home': false,
    });
  }

  initEditForm(data): void {
    this.short_description.setValue(data.short_description);
    this.long_description.setValue(data.long_description);
    this.categoryId.setValue(data.category);
    this.title.setValue(data.title);
    this.status.setValue(data.status);
    this.is_home.setValue(data.is_home);

  }

  submit(): void {
    let options = {
      id: null,
      title: this.title.value,
      long_description: this.long_description.value,
      short_description: this.short_description.value,
      categoryId: this.categoryId.value,
      status: this.status.value,
      is_home: this.is_home.value,
    };

    if (this.newsId) {
      options.id = this.newsId;
      this.newsCastService.update(options).subscribe(
        _ => {
            this.router.navigate(['/admin/actualites']);
          }
      );
      return;
    } else {

      this.newsCastService.create(options).subscribe(
        response => {
          this.router.navigate(['/admin/actualites']);
        }
      )
    }
  }

  onRemovedItem(document?: Document) {
  }

  public list() {
    
  }

  getMedias(queueList: any, mode: string) {
  
  }

  confirm(): void {
   
  }
 
  decline(): void {
  
  }

  openModal(template: TemplateRef<any>) {
  
  }

  openDraftModal(){
  
  }

  remove(): void {
  
  }

  autosaveDraft()
  {
  
  }
  

  ngOnDestroy() {
	
	}
}


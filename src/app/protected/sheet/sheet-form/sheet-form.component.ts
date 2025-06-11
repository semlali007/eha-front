import { Component, OnInit, TemplateRef, OnDestroy, HostListener, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { SheetService } from 'src/app/core/services/sheet.service';
import { Sheet } from 'src/app/shared/models/sheet';
import { AuthService } from 'src/app/core/services/auth.service';
import { UploaderService } from 'src/app/core/services/uploader.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';
import { DateService } from 'src/app/core/services/date.service';
import { Document } from 'src/app/shared/models/document';
import { Committee } from 'src/app/shared/models/committee';
import { Option } from 'src/app/shared/models/option';
import { customValidator } from '../customValidator';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { User } from 'src/app/shared/models/user';
import { Subscription } from 'rxjs';
import { invalidContractCodeValidator } from 'src/app/shared/validators/contractCodeValidator';
import { ContractService } from 'src/app/core/services/contract.service';
import { SheetFormModalDraftComponent } from './sheet-form-modal-draft/sheet-form-modal-draft.component';
import { of } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { Category } from 'src/app/shared/models/category';

@Component({
  selector: 'app-sheet-form',
  templateUrl: './sheet-form.component.html',
  styles: [
  ]
})

export class SheetFormComponent implements OnInit, OnDestroy{

  sheetForm: FormGroup;
  kitUploader: FileUploader;
  privateUploader: FileUploader;
  privateEnedisUploader: FileUploader;
  privateEdfEnedisUploader: FileUploader;
  sheetId: string;
  bsModalRef?: BsModalRef;
  bsConfirmModalRef?: BsModalRef;
  bsDraftModalRef?: BsModalRef;
  private deletedFiles: Document[];
  public user: User;
  public subscription: Subscription;
  fromNetAchat:boolean=false;

  public data = {
    subscribe: [],
    beneficiaries: [],
    stipulationAutrui: [],// ****
    edfOpen: [],
    partnership: [],
    sector: [],
    dauphin: [],
    areas: [],
    providers: [],
    status: [],
    directions: [],
    domains: [],
    committees: [],
    showcase: [],
    subdomains: [],
  };

  public params: any = {
    page: 1,
    perpage: 10,
    search: {
      searchText: '',
      searchProvider: '',
      subscribe: '',
      status:  [],
      edf_open: '',
      partnership: '',
      protected_sector: '',
      dauphin: '',
      beneficiaries: [],
      stipulationAutrui: [],
      areas: [],
      providers: [],
      directions: [],
      domains: [],
      committees: [],
      showcase: '',
      subdomains: []
    },
    sortBy: 'date',
    sortDirection: 'desc'
  };

  constructor(private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private sheetService: SheetService,
    private uploaderService: UploaderService,
    private route: ActivatedRoute,
    private dateService: DateService,
    private modalService: BsModalService,
    private contractService: ContractService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.subscription = this.authService.user$.subscribe(user => this.user = user);
    this.init();
    this.sheetService.getSheets(this.params).subscribe(
      data => {
        this.data = data.filter;
      }
    );
    this.cdr.detectChanges();
   // this.openDraftModal();
   // this.autosaveDraft();
  }

  get title() { return this.sheetForm.get('title') }
  get startDate() { return this.sheetForm.get('startDate') }
  get endDate() { return this.sheetForm.get('endDate') }
  get contracts() { return this.sheetForm.get('contracts') as FormArray; }
  get lots() { return this.sheetForm.get('lots') as FormArray; }
  get kits() { return this.sheetForm.get('kits') as FormArray; }
  get comments() { return this.sheetForm.get('comments') }
  get words() { return this.sheetForm.get('words') }
  get content() { return this.sheetForm.get('content') }
  get dauphin() { return this.sheetForm.get('dauphin') }
  get edf_open() { return this.sheetForm.get('edf_open') }
  get stipulation_for_others() { return this.sheetForm.get('stipulation_for_others') }
  get partnership() { return this.sheetForm.get('partnership') }
  get protected_sector() { return this.sheetForm.get('protected_sector') }
  get providers() { return this.sheetForm.get('providers') as any; }
  get beneficiaries() { return this.sheetForm.get('beneficiaries') as any; }
  get stipulationAutrui() { return this.sheetForm.get('stipulationAutrui') as any}//*
  get areas() { return this.sheetForm.get('areas') as any; }
  get directions() { return this.sheetForm.get('directions') as any; }
  get domains() { return this.sheetForm.get('domains') as any; }
  get status() { return this.sheetForm.get('status') as any; }
  get committeeCode() { return this.sheetForm.get('committeeCode') as any; }
  get categoryCode() { return this.sheetForm.get('categoryCode') as any; }
  get showcase() { return this.sheetForm.get('showcase') as any; }
  get subdomains() { return this.sheetForm.get('subdomains') as any; }
  get contratGroupe() { return this.sheetForm.get('contratGroupe') as any; }
  get options() { return this.sheetForm.get('options') as FormArray; }
  resetSheetForm() {
    this.sheetForm.reset();
  }

  init() {
    this.sheetId = '';
    this.deletedFiles = [];
    this.sheetForm = this.createsheetForm();
    this.kitUploader = this.uploaderService.initKit();
    this.privateUploader = this.uploaderService.initKit();
    this.privateEnedisUploader = this.uploaderService.initKit();
    this.privateEdfEnedisUploader = this.uploaderService.initKit();
    this.route.params.subscribe(params => {
      if (params.id) {
        this.sheetId = params.id;
        
        this.sheetService.getSheet(params.id).subscribe(sheet => {
          this.fromNetAchat = !!sheet.netachatId && sheet.netachatId > 0;
          this.resetSheetForm();
          if (!sheet) return;
          this.initEditForm(sheet);
        });
      }else{
        this.contracts.setValidators(Validators.required);
      }
    });
  }

  cancel() {
    if(this.sheetId)
      this.router.navigate([`app/fiches/details/${this.sheetId}`]).then( response => this.sheetService.cancel()).catch(error => this.sheetService.cancel(error));
    else{
      this.router.navigate([`app/fiches/liste`]).then( response => this.sheetService.cancel()).catch(error => this.sheetService.cancel(error));
    }
  }

  createsheetForm(): FormGroup {
    return this.sheetForm = this.fb.group({
      'options': this.fb.array([]),
      'startDate': [null, [
        Validators.required,
      ]],
      'endDate': [null, [
        Validators.required,
      ]],
      'title': ['', [
        Validators.required,
        Validators.minLength(4),
      ]],
      'contracts': this.fb.array([]), //*************** */
      'lots': this.fb.array([]),
      'comments': '',
      'words': [''],
      'content': '',
      'dauphin': false,
      'edf_open': false,
      'stipulation_for_others': false,
      'partnership': false,
      'protected_sector': false,
      'providers':[[], [
				Validators.required,
			]],
      'beneficiaries': [[], [
				Validators.required,
			]],
      'stipulationAutrui':[[]],//********* */
      'areas': [[], [
				Validators.required,
			]],
      'directions': [[], [
				Validators.required,
			]],
      'domains': [[]],
      'subdomains': [[]],
      'status': 0,
      'committeeCode': 0,
      'categoryCode': 0,
      'kits': this.fb.array([File]),
      'showcase': false,
      'contratGroupe': 'false'
    },{ validators : customValidator });
  }

  initEditForm(sheet: Sheet): void {
    this.deletedFiles = [];
    this.comments.setValue(sheet.comments);
    this.content.setValue(sheet.content);
    this.title.setValue(sheet.title);
    this.words.setValue(sheet.words);
    this.status.setValue(sheet.status);
    this.edf_open.setValue(sheet.edfOpen);
    this.stipulation_for_others.setValue(sheet.stipulationForOthers);
    this.partnership.setValue(sheet.partnership);
    this.protected_sector.setValue(sheet.protectedSector);
    this.dauphin.setValue(sheet.dauphin);

    if(sheet.startDate != '')
    {
      this.startDate.setValue(new Date(sheet.startDate));
    }

    if(sheet.endDate != '') 
    { 
      this.endDate.setValue(new Date(sheet.endDate));
    }

    this.committeeCode.setValue(sheet.committee.code);
    this.categoryCode.setValue(sheet.category.code);
    this.showcase.setValue(sheet.showcase);
    this.contratGroupe.setValue(sheet.contratGroupe || 'false');
    let providersList = [];
    sheet.providers.forEach(provider => {
      providersList.push(
        {
          code: provider.code,
          label: provider.label,
          display: provider.label,
          value: provider.label,
        }
      );
    });

    this.providers.setValue(providersList);

    let areasList = [];

    sheet.areas.forEach(area => {
      areasList.push(
        {
          code: area.code,
          label: area.label,
          display: area.label,
          value: area.label,
        }
      );
    });

    this.areas.setValue(areasList);

    let beneficiariesList = [];
    sheet.beneficiaries.forEach(beneficiary => {
      beneficiariesList.push(
        {
          code: beneficiary.code,
          label: beneficiary.label,
          display: beneficiary.label,
          value: beneficiary.label,
        }
      );
    });

    this.beneficiaries.setValue(beneficiariesList);
    //
    let stipulationAutruiList = [];
    sheet.stipulationAutrui.forEach(stipulation => {
      stipulationAutruiList.push(
        {
          code: stipulation.code,
          label: stipulation.label,
          display: stipulation.label,
          value: stipulation.label,
        }
      );
    });

    this.stipulationAutrui.setValue(stipulationAutruiList);
    
    //
    let directionsList = [];
    sheet.directions.forEach(direction => {
      directionsList.push(
        {
          code: direction.code,
          label: direction.label,
          display: direction.label,
          value: direction.label,
        }
      );
    });

    this.directions.setValue(directionsList);

    let domainsList = [];
    sheet.domains.forEach(domain => {
      domainsList.push(
        {
          code: domain.code,
          label: domain.label,
          display: domain.label,
          value: domain.label,
        }
      );
    });

    this.domains.setValue(domainsList);

    let subdomainsList = [];
    sheet.subDomains.forEach(d => {
      subdomainsList.push(
        {
          code: d.code,
          label: d.label,
          display: d.label,
          value: d.label,
        }
      );
    });

    this.subdomains.setValue(subdomainsList);

    sheet.lots.forEach(lot => {
      const lotField: FormGroup = this.fb.group({
        name: lot.name,
        description: lot.description,
      });
      this.lots.push(lotField);
    });

    if(this.fromNetAchat == false){
    sheet.contracts.forEach(contract => {
      // let contractLots = [];
      // contract.lots.forEach(contractlot => {
      //   contractLots.push({
      //     name: contractlot.name,
      //     description: contractlot.description,
      //     display: contractlot.name,
      //     value: contractlot.name,
      //   });
      // });
      const contractField: FormGroup = this.fb.group({
        code: [contract.code, [
          Validators.required,
          Validators.minLength(9),
          Validators.maxLength(10),
          Validators.pattern('^[C]{1}[a-zA-Z0-9]*$')
        ],
       // [invalidContractCodeValidator(this.contractService)]
      ],
        provider: contract.provider,
        contacts: contract.contacts,
        lots: contract.lots
      }
      );

      this.contracts.push(contractField);
    });
  }
    sheet.documents.forEach((document) => {
      var blob = new Blob([""], { type: 'text/htm' });
      blob["lastModifiedDate"] = "";
      blob["name"] = document.name;
      let f = <File>blob;

     switch (document.type) {
        case 1:
          this.kitUploader.addToQueue([f], { 'additionalParameter': { 'document': document } });
          break;
         case 2:
          this.privateUploader.addToQueue([f], { 'additionalParameter': { 'document': document } });
          break;
        case 3:
          this.privateEnedisUploader.addToQueue([f], { 'additionalParameter': { 'document': document } });
          break;
        case 4:
          this.privateEdfEnedisUploader.addToQueue([f], { 'additionalParameter': { 'document': document } });
          break;
        default:
          break;
      }
    });

    this.kitUploader.queue.forEach(item => {
      item.formData.exist = true;
    });
    this.privateUploader.queue.forEach(item => {
      item.formData.exist = true;
    });
    this.privateEnedisUploader.queue.forEach(item => {
      item.formData.exist = true;
    });
    this.privateEdfEnedisUploader.queue.forEach(item => {
      item.formData.exist = true;
    });
    sheet.options.forEach(option => {
      let startdate = new Date(option.startdate);
      let enddate = new Date(option.enddate);
      const optionField: FormGroup = this.fb.group({
        id: option.id,
        startDate: [startdate, [
          Validators.required,
          Validators.required
        ]],
        endDate: [enddate, [
          Validators.required
        ]]	
      },{ validators : customValidator });

      this.options.push(optionField);
    });
  }

  submit(draft? : boolean): void {
    let dateOptions = [];
    this.options.value.forEach(op => {
      dateOptions.push(new Option({id:op.id, startdate:op.startDate, enddate:op.endDate}));
    });
    let $options = {
      id: null,
      title: this.title.value,
      startDate: this.startDate.value,
      endDate: this.endDate.value,
      comments: this.comments.value,
      words: this.words.value,
      content: this.content.value,
      contracts: this.contracts.value,
      edf_open: this.edf_open.value,
      stipulation_for_others: this.stipulation_for_others.value,
      partnership: this.partnership.value,
      protected_sector: this.protected_sector.value,
      dauphin: this.dauphin.value,
      lots: this.lots.value,
      providers: this.providers.value,
      beneficiaries: this.beneficiaries.value,
      stipulationAutrui: this.stipulationAutrui.value,//
      areas : this.areas.value,
      directions: this.directions.value,
      domains: this.domains.value,
      status: this.status.value,
      subDomains: this.subdomains.value,
      committee: new Committee({code:this.committeeCode.value}),
      category: new Category({code:this.categoryCode.value}),
      showcase: this.showcase.value,
      contratGroupe: this.contratGroupe.value,
      options : dateOptions
    };


    if(this.sheetId == localStorage.getItem('draftId') && !draft)
    {
      localStorage.removeItem('draftId');
    }

    if (this.sheetId) {
      $options.id = this.sheetId;
      let files = {
        kits: this.getMedias(this.kitUploader.queue, 'update'),
        privates:  this.getMedias(this.privateUploader.queue, 'update'),
        privatesEnedis: this.getMedias(this.privateEnedisUploader.queue, 'update'),
        privatesEdfEnedis: this.getMedias(this.privateEdfEnedisUploader.queue, 'update'),
      };

      this.sheetService.update(new Sheet($options), files, { deletedFiles: this.deletedFiles , draft: !!draft }).subscribe(
        _ => {
          if (!!draft){
            localStorage.setItem('draftId', this.sheetId);
          }else{
            this.router.navigate(['/app/fiches/liste']);
          }
          
          this.list();
          }
      );
      return;
    } else {
      let files = {
        kits: this.getMedias(this.kitUploader.queue, 'add'),
        privates:  this.getMedias(this.privateUploader.queue, 'add'),
        privatesEnedis: this.getMedias(this.privateEnedisUploader.queue, 'add'),
        privatesEdfEnedis: this.getMedias(this.privateEdfEnedisUploader.queue, 'add'),
      };

      this.sheetService.save(new Sheet($options), files , {draft: !!draft}).subscribe(
        response => {
          if(!!draft)
          {
            localStorage.setItem('draftId', response['id']);
            this.sheetId = response['id'];
          }
          else
          {
            this.router.navigate(['/app/fiches/liste']);
          }});
    }
  }

  onRemovedItem(document?: Document) {
    this.deletedFiles.push(document);
  }

  public list() {
    this.router.navigate(
      ['app/fiches/liste']
    );
  }

  getMedias(queueList: any, mode: string) {
    const medias = [];
    queueList.forEach(item => {
      switch (mode) {
        case 'add':
          medias.push(item._file);
          break;
        case 'update':
          if (!item.formData || !item.formData.exist) {
            medias.push(item._file);
          }
          break;
        default:
          break;
      }
    });
    return medias;
  }

  confirm(): void {
    this.remove();
    this.bsConfirmModalRef?.hide();    
  }
 
  decline(): void {
    this.bsConfirmModalRef?.hide();  
  }

  openModal(template: TemplateRef<any>) {
    this.bsConfirmModalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

  openDraftModal(){
    if(!this.sheetId && !!localStorage.getItem('draftId'))
      this.bsDraftModalRef = this.modalService.show(SheetFormModalDraftComponent, {class: 'modal-sm', ignoreBackdropClick: true});
  }

  remove(): void {
    this.sheetService
      .remove({
        id: this.sheetId
      })
      .subscribe(response => this.list());
  }

  autosaveDraft()
  {
    if((!this.sheetId || localStorage.getItem('draftId') == this.sheetId))
    {
      this.sheetForm.valueChanges
      .pipe(
        debounceTime(1500),
        switchMap((value) => of(value))
      )
      .subscribe((value) => {
        this.submit(true);
      });
    }

  }
  

  ngOnDestroy() {
		this.subscription.unsubscribe();
	}
}


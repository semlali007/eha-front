import { Component, OnInit, TemplateRef, OnDestroy, HostListener, ChangeDetectorRef, Input, ViewEncapsulation } from '@angular/core';
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
import { ViewModeService } from 'src/app/core/services/view-mode.service';

@Component({
  selector: 'app-sheet-form',
  templateUrl: './sheet-form.component.html',
  styleUrls: ['./sheet-form.component.css'],
  encapsulation: ViewEncapsulation.None,
})

export class SheetFormComponent implements OnInit, OnDestroy{

  @Input() mode: 'create' | 'edit' = 'create';
  @Input() sheetId: string | null = null;
  @Input() initialData: any = null;

  sheetForm: FormGroup;
  submitted = false;
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
  private subscriptions: Subscription[] = [];
  private disableAutoRestore: boolean = false;

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
    private cdr: ChangeDetectorRef,
    private viewModeService: ViewModeService
  ) {
  }

  ngOnInit() {
    this.subscription = this.authService.user$.subscribe(user => this.user = user);
    this.subscriptions.push(this.subscription);
    
    // Initialiser le formulaire de base
    this.initializeBasicForm();
    
    // Déterminer le mode d'opération
    this.determineMode();
    
    // Initialiser selon le mode
    if (this.mode === 'create') {
      this.initializeCreateMode();
    } else if (this.mode === 'edit' && this.sheetId) {
      this.initializeEditMode();
    } else {
      // Fallback - logique existante pour compatibilité
      this.init();
    }
    
    // Charger les données de filtres
    this.loadFilterData();

    // Synchroniser le champ TVA/DUNS avec les fournisseurs sélectionnés
    this.setupVatSync();

    this.cdr.detectChanges();
  }

  /**
   * Synchronise le champ "Numéro TVA intracommunautaire ou DUNS" avec les TVA
   * des fournisseurs sélectionnés (séparées par des virgules) : mis à jour à
   * chaque ajout/retrait. Les fournisseurs sans TVA (non identifiés INSEE) sont ignorés.
   */
  private setupVatSync(): void {
    const providersCtrl = this.providers;
    if (!providersCtrl) { return; }
    const sub = providersCtrl.valueChanges.subscribe(() => this.syncVatFromProviders());
    this.subscriptions.push(sub);
  }

  private syncVatFromProviders(): void {
    const providers = (this.providers?.value as any[]) || [];

    // Garde-fou : à l'ouverture d'une fiche existante, les fournisseurs chargés
    // depuis le back ne portent pas la clé `numeroTva`. On ne touche alors PAS au
    // champ pour ne pas écraser la TVA déjà enregistrée.
    const carriesTvaInfo = providers.some(p => p && Object.prototype.hasOwnProperty.call(p, 'numeroTva'));
    if (!carriesTvaInfo && providers.length > 0) { return; }

    const tvas = providers
      .map(p => p?.numeroTva)
      .filter((tva): tva is string => typeof tva === 'string' && tva.trim().length > 0)
      // dédoublonne les TVA identiques
      .filter((tva, idx, arr) => arr.indexOf(tva) === idx);

    this.supplierVatNumber?.setValue(tvas.join(', '));
  }

  get title() { return this.sheetForm.get('title') }
  get supplierVatNumber() { return this.sheetForm.get('supplierVatNumber') }
  get entitesBeneficiairesEdfEnedis() { return this.sheetForm.get('entitesBeneficiairesEdfEnedis') }
  get geographicDetail() { return this.sheetForm.get('geographicDetail') }
  get acheteur() { return this.sheetForm.get('acheteur') }
  get contractManager() { return this.sheetForm.get('contractManager') }
  get pcmLink() { return this.sheetForm.get('pcmLink') }
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
  get miseAJourDonnee() { return this.sheetForm.get('miseAJourDonnee') as any; }
  get supplierSize() { return this.sheetForm.get('supplierSize') as any; }
  
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
        // Mode modification - conserver le mode actuel
        this.sheetId = params.id;
        
        this.sheetService.getSheet(params.id).subscribe(sheet => {
          this.fromNetAchat = !!sheet.netachatId && sheet.netachatId > 0;
          this.resetSheetForm();
          if (!sheet) return;
          this.initEditForm(sheet);
        });
      } else {
        // Mode création - basculer automatiquement en mode normal pour accéder à tous les champs
        if (this.viewModeService.isContratGroupeMode()) {
          console.log('SheetForm: Mode création détecté, passage en mode normal pour accéder à tous les champs');
          this.viewModeService.setNormalMode();
        }
        this.contracts.setValidators(Validators.required);
      }
    });
  }

  /**
   * Détermine le mode d'opération basé sur les inputs ou la route
   */
  private determineMode(): void {
    // Si le mode est explicitement passé via @Input ET qu'il vaut 'create', on force la création
    if (this.mode === 'create' && !this.route.snapshot.params.id) {
      this.sheetId = null;
      return;
    }
    
    // Si un sheetId est fourni via @Input, c'est prioritaire
    if (this.sheetId) {
      this.mode = 'edit';
    } else if (this.route.snapshot.params.id) {
      // Sinon, vérifier les paramètres de route
      this.mode = 'edit';
      this.sheetId = this.route.snapshot.params.id;
    } else {
      // Pas d'ID, c'est donc une création
      this.mode = 'create';
      this.sheetId = null;
    }
  }

  /**
   * Initialise le formulaire de base pour éviter les erreurs de template
   */
  private initializeBasicForm(): void {
    if (!this.sheetForm) {
      this.deletedFiles = [];
      this.sheetForm = this.createsheetForm();
      this.initializeBasicComponents();
    }
  }

  /**
   * Initialise le composant en mode création
   */
  private initializeCreateMode(): void {
    // Réinitialiser les variables de base
    this.sheetId = '';
    this.deletedFiles = [];
    
    // Basculer en mode normal pour accéder à tous les champs
    if (this.viewModeService.isContratGroupeMode()) {
      this.viewModeService.setNormalMode();
    }
    
    // Ajouter les validators requis pour la création
    this.contracts.setValidators(Validators.required);
  }

    /**
   * Initialise les composants de base (uploaders, etc.)
   */
  private initializeBasicComponents(): void {
    this.kitUploader = this.uploaderService.initKit();
    this.privateUploader = this.uploaderService.initKit();
    this.privateEnedisUploader = this.uploaderService.initKit();
    this.privateEdfEnedisUploader = this.uploaderService.initKit();
  }

  /**
   * Charge les données de filtres depuis le service
   */
  private loadFilterData(): void {
    const subscription = this.sheetService.getSheets(this.params).subscribe(
      data => {
        this.data = data.filter;
      }
    );
    this.subscriptions.push(subscription);
  }

  /**
   * Initialise le composant en mode édition
   */
  private initializeEditMode(): void {
    // Charger la fiche existante
    if (this.sheetId) {
      const subscription = this.sheetService.getSheet(this.sheetId).subscribe(sheet => {
        this.fromNetAchat = !!sheet.netachatId && sheet.netachatId > 0;
        this.resetSheetForm();
        if (!sheet) return;
        this.initEditForm(sheet);
      });
      this.subscriptions.push(subscription);
    }
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
      'supplierVatNumber': [''],
      'entitesBeneficiairesEdfEnedis': [''],
      'contractManager': ['', [
        Validators.minLength(2),
      ]],
      'pcmLink': ['', [
        Validators.minLength(10),
        //Validators.pattern('https?://.+')
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
      'geographicDetail': ['', [
        Validators.maxLength(1000)
      ]],
      'acheteur': ['', [
        Validators.maxLength(500)
      ]],
      'directions': [[]],
      'domains': [[]],
      'subdomains': [[]],
      'status': 0,
      'committeeCode': 0,
      'categoryCode': 0,
      'kits': this.fb.array([File]),
      'showcase': false,
      'contratGroupe': 'false',
      'miseAJourDonnee': 'non',
      'supplierSize': ''
    },{ validators : customValidator });
  }

  initEditForm(sheet: Sheet): void {
    this.deletedFiles = [];
    this.comments.setValue(sheet.comments);
    this.content.setValue(sheet.content);
    this.title.setValue(sheet.title);
    this.supplierVatNumber.setValue(sheet.supplierVatNumber || '');
    this.entitesBeneficiairesEdfEnedis.setValue(sheet.entitesBeneficiairesEdfEnedis || '');
    this.geographicDetail.setValue(sheet.geographicDetail || '');
    this.acheteur.setValue(sheet.acheteur || '');
    this.contractManager.setValue(sheet.contractManager || '');
    this.pcmLink.setValue(sheet.pcmLink || '');
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
    this.miseAJourDonnee.setValue(sheet.miseAJourDonnee || 'non');
    this.supplierSize.setValue(sheet.supplierSize?.id || '');
    
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

    // Gestion du nouveau format areas (Area | Area[])
    if (sheet.areas) {
      if (Array.isArray(sheet.areas)) {
        // Ancien format array - migration vers sélection unique (prendre le premier)
        if (sheet.areas.length > 0) {
          const firstArea = sheet.areas[0];
          this.areas.setValue(firstArea);
        }
      } else {
        // Nouveau format objet unique
        this.areas.setValue(sheet.areas);
      }
    }

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
    this.submitted = true;
    if (!draft && this.sheetForm && this.sheetForm.invalid) {
      this.sheetForm.markAllAsTouched();
      setTimeout(() => {
        const banner = document.querySelector('.adm-form-error-banner');
        banner?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
      return;
    }
    let dateOptions = [];
    this.options.value.forEach(op => {
      dateOptions.push(new Option({id:op.id, startdate:op.startDate, enddate:op.endDate}));
    });
    let $options = {
      id: null,
      title: this.title.value,
      supplierVatNumber: this.supplierVatNumber.value,
      entitesBeneficiairesEdfEnedis: this.entitesBeneficiairesEdfEnedis.value,
      geographicDetail: this.geographicDetail.value,
      acheteur: this.acheteur.value,
      contractManager: this.contractManager.value,
      pcmLink: this.pcmLink.value,
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
      miseAJourDonnee: this.miseAJourDonnee.value,
      supplierSize: this.supplierSize.value ? {
        id: parseInt(this.supplierSize.value),
        name: ''
      } : null,
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
  

  /**
   * Vérifie si on est en mode contrat groupe
   */
  public isContratGroupeMode(): boolean {
    return this.viewModeService.isContratGroupeMode();
  }

  /**
   * Vérifie si un champ doit être masqué en mode contrat groupe
   * OU si c'est un champ définitivement masqué
   */
  public shouldHideFieldInContratGroupeMode(fieldName: string): boolean {
    // Champs masqués définitivement
    const permanentlyHiddenFields = ['partnership', 'protected_sector', 'supplierSize', 'pcmLink', 'showcase'];
    if (permanentlyHiddenFields.includes(fieldName)) {
      return true;
    }

    // Champs masqués en mode contrat groupe uniquement
    if (!this.isContratGroupeMode()) {
      return false;
    }
    
    const hiddenFields = ['dauphin', 'directions', 'stipulationAutrui', 'committees'];
    return hiddenFields.includes(fieldName);
  }

  ngOnDestroy() {
    // Nettoyer toutes les subscriptions
    this.subscriptions.forEach(sub => {
      if (sub && !sub.closed) {
        sub.unsubscribe();
      }
    });
    
    // Nettoyer la subscription principale
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
  }
}


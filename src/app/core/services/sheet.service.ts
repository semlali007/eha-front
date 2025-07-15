import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfigService } from 'src/app/core/services/app-config.service';
import { Sheet } from 'src/app/shared/models/sheet'; // On importe notre modèle métier Workday.
import { Contract } from 'src/app/shared/models/contract';
import { Provider } from 'src/app/shared/models/provider';
import { Lot } from 'src/app/shared/models/lot';
import { Document } from 'src/app/shared/models/document';
import { ToastrService } from './toastr.service';
import { ErrorService } from './error.service';
import { LoaderService } from './loader.service';
import { tap, catchError, finalize, switchMap } from 'rxjs/operators'; // ajouter switchMap
import { of, Observable } from 'rxjs';
import { Beneficiary } from 'src/app/shared/models/beneficiary';
import { Stipulation } from 'src/app/shared/models/stipulation';//**************** */
import { Area } from 'src/app/shared/models/area';
import { Direction } from 'src/app/shared/models/direction';
import { DateService } from 'src/app/core/services/date.service';
import { Status } from 'src/app/shared/models/status';
import { Committee } from 'src/app/shared/models/committee';
import { Option } from 'src/app/shared/models/option';
import { Domain } from 'src/app/shared/models/domain';
import { Category } from 'src/app/shared/models/category';
@Injectable({
  providedIn: 'root'
})
export class SheetService {

  constructor(
    private appConfigService: AppConfigService,
    private http: HttpClient,
    private toastrService: ToastrService,
    private errorService: ErrorService,
    private loaderService: LoaderService,
    private dateService: DateService
  ) { }

  save(sheet: Sheet, files: any, params: {
    draft: boolean,
  }) {
    var url = '';
    var message = '';
    switch(params.draft) { 
      case false: {
        url = `${this.appConfigService.basePath}/sheets/add`;
        message = 'Votre fiche a été enregistrée avec succès.'
        this.loaderService.setLoading(true);
         break; 
      } 
      case true: { 
        url = `${this.appConfigService.basePath}/sheets/addDraft`;
        message = 'Votre brouillon a été enregistré avec succès.' 
         break; 
      } 
   } 
    
    const data = this.getSheetForApi(sheet);
    let fd = this.addMediasToFormData(files);
    fd.append('model', JSON.stringify(data));
    return this.http.post(url, fd).pipe(
      switchMap(data => {
        return of(data);
      }),

      tap(_ => 
        this.toastrService.showToastr({
        category: 'success',
        message: message
      })),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );
  }

  addMediasToFormData(files: any): FormData {
    let fd = new FormData();
    files.kits.forEach(item => {
      fd.append('kits[]', item);
    });

    files.privates.forEach(item => {
      fd.append('privates[]', item);
    });

    files.privatesEnedis.forEach(item => {
      fd.append('privates_enedis[]', item);
    });

    files.privatesEdfEnedis.forEach(item => {
      fd.append('privates_edf_enedis[]', item);
    });
    return fd;
  }

  update(sheet: Sheet, files: any, params: {
    deletedFiles: Document[],
    draft: boolean,
  }) {
    var url = '';
    var message = '';
    switch(params.draft) { 
      case false: {
        url = `${this.appConfigService.basePath}/sheets/save`;
        message = 'Votre fiche a été enregistrée avec succès.'
        this.loaderService.setLoading(true);
         break; 
      } 
      case true: { 
        url = `${this.appConfigService.basePath}/sheets/saveDraft`;
        message = 'Votre brouillon a été enregistré avec succès.' 
         break; 
      } 
   } 

    const data = this.getSheetForApi(sheet);
    data.deletedFiles = this.getDeletedFilesForApi(params.deletedFiles);;
    data.id = sheet.id;
    let fd = this.addMediasToFormData(files);
    fd.append('model', JSON.stringify(data));

    return this.http.post(url, fd).pipe(
      tap(_ => this.toastrService.showToastr({
        category: 'success',
        message: message
      })),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );
  }

  private getSheetForApi(sheet: Sheet): any {
    const contracts: Object = this.getContractListForApi(sheet.contracts);
    const providers: Object = this.getProviderListForApi(sheet.providers);
    const beneficiaries: Object = this.getBeneficiaryListForApi(sheet.beneficiaries);
    const stipulationAutrui: Object = this.getStipulationListForApi(sheet.stipulationAutrui);//
    const areas: Object = this.getAreasListForApi(sheet.areas);
    const directions: Object = this.getDirectionsListForApi(sheet.directions);
    
    const result = {
      label: sheet.title,
      supplier_vat_number: sheet.supplierVatNumber,
      contract_manager: sheet.contractManager,
      pcm_link: sheet.pcmLink,
      description: sheet.comments,
      words: sheet.words,
      status: sheet.status,
      contracts: contracts,
      content: sheet.content,
      lots: sheet.lots,
      start_date: sheet.startDate,
      end_date: sheet.endDate,
      dauphin: sheet.dauphin,
      edf_open: sheet.edfOpen,
      stipulation_for_others: sheet.stipulationForOthers,
      partnership: sheet.partnership,
      protected_sector: sheet.protectedSector,
      providers: providers || [],
      filiales: beneficiaries || [],
      filiales0: stipulationAutrui || [],
      zones: areas || [],
      groups: directions || [],
      committee: sheet.committee.code,
      category: sheet.category.code,
      showcase: sheet.showcase,
      options: sheet.options,
      domains: sheet.domains,
      subdomains: sheet.subDomains,
      contrat_groupe: sheet.contratGroupe || 'false',
      mise_a_jour_donnee: sheet.miseAJourDonnee || 'non',
      id_supplier_size: sheet.supplierSize?.id || null,
      entites_beneficiaires_edf_enedis: sheet.entitesBeneficiairesEdfEnedis || null,
      geographic_detail: sheet.geographicDetail || null,
      acheteur: sheet.acheteur || null
    };
    
    return result;
  }

  private getDeletedFilesForApi(documents: Document[]): any {
    let documentsList = [];
    documents.forEach(d => {
      if (!!d.id) {
        documentsList.push({
          file_id: d.id,
          file_url: d.url,
          file_name: d.name
        })
      }
    });
    return documentsList;
  }
  private getProviderListForApi(providers: Provider[]): any {
    let pList = [];
    providers.forEach(p => {
      if (!!p.code && p.code.length != 0) {
        pList.push({
          id: p.code,
        })
      }
    });
    return pList;
  }

  private getAreasListForApi(areas: Area[]): any {
    let areaList = [];

    areas.forEach(p => {
      if (!!p.code && p.code.length != 0) {
        areaList.push({
          id: p.code,
          name: p.label
        })
      }
    });
    return areaList;
  }

  private getDirectionsListForApi(directions: Direction[]): any {
    let dirs = [];

    directions.forEach(p => {
      if (!!p.code && p.code.length != 0) {
        dirs.push({
          id: p.code,
          name: p.label,
          tooltip: p.tooltip
        })
      }
      
    });
    return dirs;
  }

  private getBeneficiaryListForApi(beneficiaries: Beneficiary[]): any {
    let pList = [];

    beneficiaries.forEach(p => {
      if (!!p.code && p.code.length != 0) {
        pList.push({
          id: p.code,
          name: p.label
        })
      }
    });
    return pList;
  }

  // 
  private getStipulationListForApi(stipulationAutrui: Stipulation[]): any {
    let pList = [];

    stipulationAutrui.forEach(p => {
      if (!!p.code && p.code.length != 0) {
        pList.push({
          id: p.code,
          name: p.label
        })
      }
    });
    return pList;
  }
  private getContractListForApi(contracts: Contract[]): any {
    let contractList = [];

    contracts.forEach(c => {
      if (!!c.code && c.code.length != 0) {
        contractList.push(this.getContractForApi(c));
      }
    });

    return contractList;
  }

  private getContractForApi(contract: Contract): any {
    // let lotsList = [];

    // contract.lots.forEach(lot => {
    //   if (!!lot.name && lot.name.length != 0) {
    //     lotsList.push(({
    //       name: lot.name
    //     }));
    //   }
    // });

    return {
      contract_code: contract.code,
      provider: contract.provider,
      // lots: lotsList,
      lots: contract.lots,
      contacts: contract.contacts
    }
  }

  clear(word:any){
    word = word.trim();
    return word;
  }

  getSheets(params: any): any {
    const url = `${this.appConfigService.basePath}/sheets`;
    this.loaderService.setLoading(true);
    let options: any = {};

    options.page = params.page || 1;
    options.perpage = params.perpage || 1;
    options.is_search = params.isSearch || false;

    options.search = params.search || { searchText: '', status: '', searchProvider:'' };
    options.search.providers = !!options.search.providers? options.search.providers: [];
    options.search.searchText= this.clear(options.search.searchText)

    switch (params.sortBy) {
      case 'date':
        options.order_by = 'updated_at';
        break;
      case 'title':
        options.order_by = 'label';
        break;
      default:
        options.order_by = params.sortBy;
        break;
    }

    options.direction = params.sortDirection;

    return this.http.post(url, options).pipe(
      switchMap((sheetData: any) => {
        const sheets: Sheet[] = [];
        sheetData.sheets.forEach(data => {
          if (data) {
            const sheet: Sheet = this.getMinSheetFromApi(data);
            sheets.push(sheet);
          }
        })

        const statusList = [];
        sheetData.filter.status.forEach(s => {
          const status = new Status({ code: s.code })
          statusList.push({
            code: status.code,
            label: status.label,
            count: s.count
          })
        });

        return of({
          total: sheetData.total,
          sheets: sheets,
          filter: {
            subscribe: sheetData.filter.subscribe,
            edfOpen: sheetData.filter.edf_open,
            partnership: sheetData.filter.partnership,
            sector: sheetData.filter.protected_sector,
            dauphin: sheetData.filter.dauphin,
            status: statusList,
            beneficiaries: sheetData.filter.beneficiaries,
            stipulationAutrui: sheetData.filter.stipulationAutrui,//**** */
            areas: sheetData.filter.areas,
            providers: sheetData.filter.providers,
            directions: sheetData.filter.directions,
            committees: sheetData.filter.committees,
            showcase: sheetData.filter.showcase,
            contratGroupe: sheetData.filter.contratGroupe,
            miseAJourDonnee: sheetData.filter.miseAJourDonnee,
            supplierSize: sheetData.filter.supplierSize || []
          }
        });
      }),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))

    );
  }

  getSheet(id: any): Observable<Sheet | null> {
    const url = `${this.appConfigService.basePath}/sheets/show/${id}`;
    this.loaderService.setLoading(true);
    return this.http.get(url).pipe(
      switchMap((sheetData: any) => {
        return of(this.getSheetFromApi(sheetData.sheet));
      }),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );
  }
 

  public getHistory(id: any, page: number): Observable<any> {
    const url = `${this.appConfigService.basePath}/sheets/history`;
    return this.http.post(url, {id:id, page:page}).pipe(
      switchMap((sheetData: any) => {
        return of(sheetData);
      }),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );
  }
  private getMinSheetFromApi(fields): Sheet {
    return new Sheet({
      id: fields.id,
      title: fields.label,
      updated_at: fields.updated_at,
      created_at: !!fields.created_at ? fields.created_at : '',
      status: fields.status,
      subscribed: fields.subscribed,
    });
  };

  private getSheetFromApi(fields): Sheet {
    const contracts: Contract[] = [];
    fields.contracts.forEach(data => {
      const contract: Contract = new Contract({
        code: data.contract_code,
        provider: data.provider,
        lots: data.lots,
        systems: !!data.systems ? data.systems.split('|') : [],
        contacts: data.contacts,
      });
      contracts.push(contract);
    });

    const lots: Lot[] = [];
    fields.lots.forEach(data => {
      const lot: Lot = new Lot({
        name: data.name,
        description: data.description,
      });
      lots.push(lot);
    });

    const options: Option[] = [];
    fields.options.forEach(data => {
      const option: Option = new Option({
        id: data.id,
        startdate: data.start_date,
        enddate: data.end_date,
      });
      options.push(option);
    });

    const beneficiaries: Beneficiary[] = [];
    fields.filiales.forEach(data => {
      const p: Beneficiary = new Beneficiary({
        code: data.id,
        label: data.name,
      });
      beneficiaries.push(p);
    });
    //
    const stipulationAutrui: Stipulation[] = [];
    fields.filiales0.forEach(data => {
      const p: Stipulation = new Stipulation({
        code: data.id,
        label: data.name,
      });
      stipulationAutrui.push(p);
    });
    const areas: Area[] = [];
    fields.zones.forEach(data => {
      const p: Area = new Area({
        code: data.id,
        label: data.name,
      });
      areas.push(p);
    });
    const directions: Direction[] = [];
    fields.groups.forEach(data => {
      const p: Direction = new Direction({
        code: data.id,
        label: data.name,
      });
      directions.push(p);
    });

    const providers: Provider[] = [];
    fields.providers.forEach(data => {
      const p: Provider = new Provider({
        code: data.id,
        label: data.name,
      });
      providers.push(p);
    });

    const documents: Document[] = [];
    fields.documents.forEach(data => {
      const d: Document = new Document({
        name: data.file_name,
        url: data.file_url,
        id: data.id,
        type: data.type
      });
      documents.push(d);
    });

    let committee: Committee;
    if (fields.committee && fields.committee.code && fields.committee.label) {
      committee = new Committee({
        code: fields.committee.code,
        label: fields.committee.label,
      })
    } else {
      committee = new Committee();
    }

    let category: Category;
    if (fields.category && fields.category.code && fields.category.label) {
      category = new Category({
        code: fields.category.code,
        label: fields.category.label,
      })
    } else {
      category = new Category();
    }

    const domains: Domain[] = [];
    fields.domain.forEach(data => {
      const dom: Domain = new Domain({
        code: data.id,
        label: data.name,
        type: data.type
      });
      domains.push(dom);
    });

    const subDomains: Domain[] = [];
    fields.subdomain.forEach(data => {
      const subdom: Domain = new Domain({
        code: data.id,
        label: data.name,
        type: data.type
      });
      subDomains.push(subdom);
    });

    return new Sheet({
      id: fields.id,
      title: fields.label,
      supplierVatNumber: fields.supplier_vat_number,
      contractManager: fields.contract_manager,
      pcmLink: fields.pcm_link,
      comments: fields.description,
      words: fields.search_words,
      startDate: fields.start_date,
      endDate: fields.end_date,
      contracts: contracts,
      lots: lots,
      status: fields.status,
      dauphin: fields.dauphin,
      edf_open: fields.edf_open,
      stipulation_for_others: fields.stipulation_for_others,
      partnership: fields.partnership,
      protected_sector: fields.protected_sector,
      providers: providers,
      beneficiaries: beneficiaries,
      stipulationAutrui: stipulationAutrui,//** */
      areas: areas,
      directions: directions,
      documents: documents,
      updated_at: fields.updated_at,
      committee: committee,
      category: category,
      showcase: fields.showcase,
      options: options,
      subscribed: fields.subscribed,
      netachatId: fields.netachat_id,
      netachatType: fields.netachat_type,
      content: fields.content,
      domains: domains,
      subDomains: subDomains,
      history: fields.history,
      contratGroupe: fields.contrat_groupe,
      miseAJourDonnee: fields.mise_a_jour_donnee,
      entitesBeneficiairesEdfEnedis: fields.entites_beneficiaires_edf_enedis,
      geographicDetail: fields.geographic_detail,
      acheteur: fields.acheteur,
      supplierSize: fields.supplier_size ? {
        id: fields.supplier_size.id,
        name: fields.supplier_size.name
      } : null
    });
  }



  public remove(params): Observable<any> {
    let url = `${this.appConfigService.basePath}/sheets/remove/${params.id}`;
    this.loaderService.setLoading(true);
    return this.http.get(url).pipe(
      tap(_ => this.toastrService.showToastr({
        category: 'success',
        message: 'Vos informations ont été mises à jour !'
      })),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => this.loaderService.setLoading(false))
    );
  }

    public sheetSubscribe(params): Observable<any> {
    const url = `${this.appConfigService.basePath}/sheets/subscribe`;
    return this.http.post(url, params).pipe(
      tap(_ => console.log('success')),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => console.log('ok'))
    );
  }

  public sheetUnsubscribe(params): Observable<any> {
    const url = `${this.appConfigService.basePath}/sheets/unsubscribe`;
    return this.http.post(url, params).pipe(
      tap(_ => console.log('success')),
      catchError(error => this.errorService.handleError(error)),
      finalize(() => console.log('ok'))
    );
  }

  public sheetValidate(params): any
  {
    if(params.get('options') != null)
    {
      Object.keys(params.get('options').controls).forEach(option => {
        Object.keys(params.get('options').get(option).controls).forEach(elem =>{
          let control = params.get('options').get(option).get(elem);
          control.updateValueAndValidity();
        })
      })
    }
  }

  public cancel(error?){

    if(error){
      this.errorService.handleError(error);
    }
    else{
      this.toastrService.showToastr({
        category: 'warning',
        message: 'Vos modifications ont bien été annulées.'
      });
    }
  }

  public redirectToDraft(error?){

    if(error){
      this.errorService.handleError(error);
    }
    else{
      this.toastrService.showToastr({
        category: 'success',
        message: 'Votre brouillon a bien été chargé.'
      });
    }
  }

}


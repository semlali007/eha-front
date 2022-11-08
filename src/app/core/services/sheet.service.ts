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
import { Area } from 'src/app/shared/models/area';
import { Direction } from 'src/app/shared/models/direction';
import { DateService } from 'src/app/core/services/date.service';
import { Status } from 'src/app/shared/models/status';
import { Committee } from 'src/app/shared/models/committee';
import { Option } from 'src/app/shared/models/option';
import { Domain } from 'src/app/shared/models/domain';
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
        message = 'Votre Fiche a été enregistrée avec succès.'
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
        message = 'Votre Fiche a été enregistrée avec succès.'
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
    const areas: Object = this.getAreasListForApi(sheet.areas);
    const directions: Object = this.getDirectionsListForApi(sheet.directions);
    return {
      label: sheet.title,
      description: sheet.comments,
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
      zones: areas || [],
      groups: directions || [],
      committee: sheet.committee.code,
      showcase: sheet.showcase,
      options: sheet.options,
      domains: sheet.domains,
      subdomains: sheet.subDomains
    }
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
    let lotsList = [];

    contract.lots.forEach(lot => {
      if (!!lot.name && lot.name.length != 0) {
        lotsList.push(({
          name: lot.name
        }));
      }
    });

    return {
      contract_code: contract.code,
      provider: contract.provider,
      lots: lotsList,
      contacts: contract.contacts
    }
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
            areas: sheetData.filter.areas,
            providers: sheetData.filter.providers,
            directions: sheetData.filter.directions,
            committees: sheetData.filter.committees,
            showcase: sheetData.filter.showcase
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
      comments: fields.description,
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
      areas: areas,
      directions: directions,
      documents: documents,
      updated_at: fields.updated_at,
      committee: committee,
      showcase: fields.showcase,
      options: options,
      subscribed: fields.subscribed,
      netachatId: fields.netachat_id,
      netachatType: fields.netachat_type,
      content: fields.content,
      domains: domains,
      subDomains: subDomains
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


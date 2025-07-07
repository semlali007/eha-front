import { Component, OnInit, OnDestroy,TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SheetService } from 'src/app/core/services/sheet.service';
import { Sheet } from 'src/app/shared/models/sheet';
import { DateService } from 'src/app/core/services/date.service';
import { Status } from 'src/app/shared/models/status';
import { environment } from 'src/environments/environment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { User } from 'src/app/shared/models/user';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import * as fileSaver from 'file-saver';
import { FileService } from 'src/app/core/services/file.service';
import { ViewModeService } from 'src/app/core/services/view-mode.service';

import jspdf from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-sheet-view',
  templateUrl: './sheet-view.component.html',
  styleUrls: ['./sheet-view.component.css']
})
export class SheetViewComponent implements OnInit, OnDestroy {
  public sheetId: string;
  public title: any = '';
  public page = 0;
  public totalHistory = 0;
  public startDate: any;
  public endDate: any;
  public contracts: Object[] = [];
  public lots: Object[] = [];
  public kits: Object[] = [];
  public privates: Object[] = [];
  public privatesEnedis: Object[] = [];
  public privatesEdfEnedis: Object[] = [];
  public bsConfirmModalRef?: BsModalRef;
  public comments: any;
  public words: any;
  public dauphin: any;
  public edf_open: any;
  public stipulation_for_others: any;
  public partnership: any;
  public protected_sector: any;
  public providers: Object[] = [];
  public beneficiaries: Object[] = [];
  public stipulationAutrui: Object[] = [];
  public areas: Object[] = [];
  public directions: Object[] = [];
  public status: any;
  public statusCode: number;
  public committee: any = '';
  public user: User;
  public subscription: Subscription;
  public showcase: any;
  public openedContractCode: string = '';
  public options: Object[] = [];
  public subscribed: Boolean = false;
  public fullContent: any;
  public netachatId: any;
  public netachatType: any;
  public domain: Object[] = [];
  public subDomain: Object[] = [];
  public history: any[] = [];
  public category: any = '';
  public contratGroupe: any = '';
  public miseAJourDonnee: any = '';
  public supplierSize: {id: number, name: string} | null = null;
  isCollapsed = true;

  @ViewChild('content') content:ElementRef;

  constructor(
    private route: ActivatedRoute,
    private sheetService: SheetService,
    private dateService: DateService,
    private router: Router,
    private modalService: BsModalService,
    private authService: AuthService,
    private fileService: FileService,
    private viewModeService: ViewModeService
  ) { }

  ngOnInit(): void {
    this.subscription = this.authService.user$.subscribe(user => this.user = user);
    this.route.params.subscribe(params => {
      if (params.id) {
       // this.router.navigate([`app/fiches/details/${sheetId}`], { queryParams: { history: 'history' } });
        this.sheetId = params.id;
        this.sheetService.getSheet(params.id).subscribe(sheet => {
          if (!sheet) return;
          this.initSheet(sheet);
          this.onScroll();
        });
      }
    });
  }

  public initSheet(sheet: Sheet): void {
    const statusList = (new Status).getStatusList();
    statusList.forEach(s => {
      if (s.code == sheet.status) {
        this.status = s.label;
        this.statusCode = s.code;
      }
    })

    this.subscribed = sheet.subscribed;
    this.comments = sheet.comments;
    this.words = sheet.words;
    this.title = sheet.title;
    this.committee = sheet.committee;
    this.category = sheet.category;
    this.showcase = sheet.showcase;
    this.contratGroupe = sheet.contratGroupe;
    this.miseAJourDonnee = sheet.miseAJourDonnee;
    this.supplierSize = sheet.supplierSize;
    this.edf_open = sheet.edfOpen;
    this.stipulation_for_others = sheet.stipulationForOthers;
    this.partnership = sheet.partnership;
    this.protected_sector = sheet.protectedSector;
    this.dauphin = sheet.dauphin;
    this.fullContent = sheet.content;
    this.netachatId = sheet.netachatId;
    this.netachatType = sheet.netachatType;
    this.startDate = this.dateService.getDisplayDate(new Date(sheet.startDate));
    this.endDate = this.dateService.getDisplayDate(new Date(sheet.endDate));
     sheet.domains.forEach(d => {
      this.domain.push(
        {
          code: d.code,
          label: d.label,
        }
      );
    });

    sheet.subDomains.forEach(d => {
      this.subDomain.push(
        {
          code: d.code,
          label: d.label,
        }
      );
    });

    sheet.providers.forEach(provider => {
      this.providers.push(
        {
          code: provider.code,
          label: provider.label,
        }
      );
    });

    sheet.areas.forEach(area => {
      this.areas.push(
        {
          code: area.code,
          label: area.label,
        }
      );
    });

    sheet.beneficiaries.forEach(beneficiary => {
      this.beneficiaries.push(
        {
          code: beneficiary.code,
          label: beneficiary.label,
        }
      );
    });
    // ***************
    sheet.stipulationAutrui.forEach(stipulation => {
      this.stipulationAutrui.push(
        {
          code: stipulation.code,
          label: stipulation.label,
        }
      );
    });

    sheet.directions.forEach(direction => {
      this.directions.push(
        {
          code: direction.code,
          label: direction.label,
        }
      );
    });

    sheet.lots.forEach(lot => {
      this.lots.push({
        name: lot.name,
        description: lot.description,
      });
    });

    sheet.options.forEach(op => {
      this.options.push({
        startDate: this.dateService.getDisplayDate(new Date(op.startdate)),
        endDate: this.dateService.getDisplayDate(new Date(op.enddate)),
      });
    });

    sheet.contracts.forEach(contract => {
      let systems = [];
      contract.systems.forEach(
        system => {
          if (!!system) {
            let itemSystem = system.split('__');
            if (itemSystem.length > 0 && !!itemSystem[0] && itemSystem[0].length > 0) {
              systems.push({
                code: itemSystem[0],
                label: itemSystem[1],
              });
            }
          }
        })
      const contractField = {
        code: contract.code,
        provider: contract.provider.replace(/\r\n/g, '<br>'),
        lots: contract.lots,
        contacts: contract.contacts.replace(/\r\n/g, '<br>'),
        systems: systems,
      };
      this.contracts.push(contractField);
      
    });

    // sheet.contracts.forEach(contract => {
    //   let contractLots = [];
    //   contract.lots.forEach(contractlot => {
    //     contractLots.push({
    //       name: contractlot.name,
    //       description: contractlot.description,
    //     });
    //   });

    //   let systems = [];
    //   contract.systems.forEach(
    //     system => {
    //       if (!!system) {
    //         let itemSystem = system.split('__');
    //         if (itemSystem.length > 0 && !!itemSystem[0] && itemSystem[0].length > 0) {
    //           systems.push({
    //             code: itemSystem[0],
    //             label: itemSystem[1],
    //           });
    //         }
    //       }
    //     })
    //   const contractField = {
    //     code: contract.code,
    //     provider: contract.provider,
    //     lots: contractLots,
    //     contacts: contract.contacts,
    //     systems: systems,
    //   };
    //   this.contracts.push(contractField);
    // });

    sheet.documents.forEach((document) => {
      switch (document.type) {
        case 1:
          this.kits.push(document);
          break;
        case 2:
          this.privates.push(document);
          break;
        case 3:
          this.privatesEnedis.push(document);
          break;
        case 4:
          this.privatesEdfEnedis.push(document);
          break;
        default:
          break;
      }
    });

  }

  public modification(id: string) {
    this.router.navigate([`app/fiches/modification/${id}`])
  }

  public list() {
    this.router.navigate(
      ['app/fiches/liste']
    );
  }

  confirm(): void {
    this.remove();
    this.bsConfirmModalRef?.hide();
  }

  decline(): void {
    this.bsConfirmModalRef?.hide();
  }

  remove(): void {

    if(this.sheetId == localStorage.getItem('draftId'))
    {
      localStorage.removeItem('draftId');
    }
    this.sheetService
      .remove({
        id: this.sheetId
      })
      .subscribe(response => this.list());
  }

  openModal(template: TemplateRef<any>) {
    this.bsConfirmModalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

  public showContract(contract) {
    this.router.navigate(
      [ `app/contrat/details/${contract.code}`]
    );
  }

  ngOnDestroy() {
		this.subscription.unsubscribe();
	}

  downloadKit(kit) {
    this.fileService.sheetDocument({ url: kit.url }).subscribe((response: any) => {
      let blob: any = new Blob([response]);
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob, kit.name);
      }
      else {
        const url = window.URL.createObjectURL(blob);
        fileSaver.saveAs(blob, kit.name);
      };
    });
  }

  public openPDF():void {
      let DATA = document.getElementById('htmlData');
      html2canvas(DATA).then(canvas => {
        const imgData = canvas.toDataURL('image/png', 1.0)

        var imgWidth = 210; 
        var pageHeight = 295;  
        var imgHeight = canvas.height * imgWidth / canvas.width;
        var heightLeft = imgHeight;
        var doc = new jspdf('p', 'mm');
        var position = 0;
        
        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          doc.addPage();
          doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        doc.save( 'file.pdf');    

      });     
  }

  openChange(event: boolean, contractCode:string) {
    this.openedContractCode = event? contractCode: '';
  }

  isOpened(contract) {
    return this.openedContractCode == contract.code ;
  }

  subscribe(sheetId: number){

      this.sheetService
        .sheetSubscribe({
          sheet: sheetId,
          user: this.user.nni
        }).subscribe((response: any) => {
          this.subscribed = true;
        });


  }
  unsubscribe(sheetId: number){

    this.sheetService
      .sheetUnsubscribe({
        sheet: sheetId,
        user: this.user.nni
      }).subscribe((response: any) => {
        this.subscribed = false;
      });


}

onScroll(): void {
  this.sheetService
    .getHistory(this.sheetId, this.page)
    .subscribe(data => {
      this.history.push(...data.history.data);
      this.totalHistory = data.history.total;
      this.page++;
    });
}

/**
 * Vérifie si on est en mode contrat groupe
 */
isContratGroupeMode(): boolean {
  return this.viewModeService.isContratGroupeMode();
}

/**
 * Détermine si un champ doit être masqué en mode contrat groupe
 * @param fieldName - Le nom du champ ('dauphin' ou 'directions')
 */
shouldHideFieldInContratGroupeMode(fieldName: string): boolean {
  if (!this.isContratGroupeMode()) {
    return false;
  }
  
  const hiddenFields = ['dauphin', 'directions', 'partnership', 'stipulationAutrui', 'committees', 'supplierSize', 'domain','subDomain'];
  return hiddenFields.includes(fieldName);
}
}

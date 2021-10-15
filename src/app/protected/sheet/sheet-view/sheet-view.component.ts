import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SheetService } from 'src/app/core/services/sheet.service';
import { Sheet } from 'src/app/shared/models/sheet';
import { DateService } from 'src/app/core/services/date.service';
import { Status } from 'src/app/shared/models/status';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/shared/models/user';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/auth.service';
import * as fileSaver from 'file-saver';
import { FileService } from 'src/app/core/services/file.service';

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
  public startDate: any;
  public endDate: any;
  public contracts: Object[] = [];
  public lots: Object[] = [];
  public kits: Object[] = [];
  public privates: Object[] = [];
  public privatesEnedis: Object[] = [];
  public privatesEdfEnedis: Object[] = [];
   
  public comments: any;
  public dauphin: any;
  public edf_open: any;
  public stipulation_for_others: any;
  public partnership: any;
  public protected_sector: any;
  public providers: Object[] = [];
  public beneficiaries: Object[] = [];
  public areas: Object[] = [];
  public directions: Object[] = [];
  public status: any;
  public committee: any = '';
  public user: User;
  public subscription: Subscription;
  public showcase: any;
  public openedContractCode: string = '';
  public options: Object[] = [];

  @ViewChild('content') content:ElementRef; 

  constructor(
    private route: ActivatedRoute,
    private sheetService: SheetService,
    private dateService: DateService,
    private router: Router,
    private authService: AuthService,
    private fileService: FileService,
  ) { }

  ngOnInit(): void {
    this.subscription = this.authService.user$.subscribe(user => this.user = user);
    this.route.params.subscribe(params => {
      if (params.id) {
        this.sheetId = params.id;
        this.sheetService.getSheet(params.id).subscribe(sheet => {
          if (!sheet) return;
          this.initSheet(sheet);
        });
      }
    });
  }

  public initSheet(sheet: Sheet): void {
    const statusList = (new Status).getStatusList();
    statusList.forEach(s => {
      if (s.code == sheet.status) {
        this.status = s.label;
      }
    })

    this.comments = sheet.comments;
    this.title = sheet.title;
    this.committee = sheet.committee;
    this.showcase = sheet.showcase;
    this.edf_open = sheet.edfOpen;
    this.stipulation_for_others = sheet.stipulationForOthers;
    this.partnership = sheet.partnership;
    this.protected_sector = sheet.protectedSector;
    this.dauphin = sheet.dauphin;
    this.startDate = this.dateService.getDisplayDate(new Date(sheet.startDate));
    this.endDate = this.dateService.getDisplayDate(new Date(sheet.endDate));
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
      console.log(op);
      this.options.push({
        startDate: this.dateService.getDisplayDate(new Date(op.startdate)),
        endDate: this.dateService.getDisplayDate(new Date(op.enddate)),
      });
    });

    sheet.contracts.forEach(contract => {
      let contractLots = [];
      contract.lots.forEach(contractlot => {
        contractLots.push({
          name: contractlot.name,
          description: contractlot.description,
        });
      });
      
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
        provider: contract.provider,
        lots: contractLots,
        contacts: contract.contacts,
        systems: systems,
      };
      this.contracts.push(contractField);
    });
   
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

  public showContract(contract, system) {
    this.router.navigate(
      [ `app/contrat/details/${contract.code}-${system}`]
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


  public openPDF():void {
    let DATA = document.getElementById('htmlData');
        
    html2canvas(DATA).then(canvas => {
        
        let fileWidth = 208;
        let fileHeight = canvas.height * fileWidth / canvas.width;
        
        const FILEURI = canvas.toDataURL('image/png')
        let PDF = new jspdf('p', 'mm', 'a4');
        let position = 0;
        PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight)
        
        PDF.save('angular-demo.pdf');
    });     
    } 


  openChange(event: boolean, contractCode:string) {
    this.openedContractCode = event? contractCode: '';
  }

  isOpened(contract) {
    return this.openedContractCode == contract.code ;
  }
}

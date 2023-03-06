import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { HotlineService } from 'src/app/core/services/hotline.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { HotlineListEmailComponent } from '../hotline-list-email/hotline-list-email.component';
import { User } from 'src/app/shared/models/user';
import { Subscription, Observable } from 'rxjs';
import { ExcelService } from 'src/app/core/services/excel.service';
import {  ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-hotline-list',
  templateUrl: './hotline-list.component.html',
  styles: [
  ]
})
export class HotlineListComponent implements OnInit, OnDestroy {
  codesForm: FormGroup;
  sub: Subscription;
  new: [] = [];
  progress: [] = [];
  end: [] = [];
  categories: any = [];
  email: string = '';
  active: string = 'new';
  bsModalRef: BsModalRef;
  public user: User = null;
  userSubscription: Subscription;
  hotlineSubscription: Subscription;
  public currentEmail: string = '';
 

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private hotlineService: HotlineService,
    private modalService: BsModalService,
    private excelService: ExcelService,
    private route: ActivatedRoute,
  ) { }
  get codeFilter() { return this.codesForm.get('codeFilter') as any; }
  ngOnInit(): void {
    this.codesForm = this.fb.group({
      'codeFilter': '',
    });
    
    this.email = this.authService.currentUser.email;
    this.userSubscription = this.authService.user$.subscribe(user => this.user = user);
    this.hotlineSubscription = this.hotlineService.emailHotline$.subscribe(currentEmail => this.currentEmail = currentEmail || this.email);
    
    
    this.sub = this.route.queryParams.subscribe(params => {
      if (!!params && !!params.step) {
        this.setActive(params.step);
      }
    });

    this.loadList();
    this.hotlineService.getConfig().subscribe(
      config => {
        config.families.forEach(family => {
          family.categories.forEach(categ => {
            this.categories.push({
              code: categ.code,
              label: categ.label,
              family: family.code,
            }
            )
          })
        });
      }
    )
  }

  setActive(status: string) {
    this.active = status;
  }

  isActive(status: string) {
    return !!(status == this.active);
  }

  public onsSubmittedFilter(filter: any) {
    this.loadList(filter);
  }

  private loadList(filter?: any) {
    let params: any = {};
    if (!!filter && !!filter.category) {
      params.category = filter.category;
    }

    params.email = this.currentEmail;

    this.hotlineService
      .getHotlineByUser(params)
      .subscribe(hotlines => {
        this.new = hotlines.new;
        this.progress = hotlines.progress;
        this.end = hotlines.end;
      }
      );
  }

  openEdit() {
    const initialState = {
      actualEmail: this.currentEmail,
    };
    this.bsModalRef = this.modalService.show(HotlineListEmailComponent, { initialState });
    this.bsModalRef.content.closeBtnName = 'Fermer';
    this.bsModalRef.content.afterEdit.subscribe(response => {
      if (!!response && !!response.email) {
        this.hotlineService.setEmail(response.email);
        this.loadList({ email: response.email });
      }
    });
  }

  resetMail(){
    this.hotlineService.setEmail(this.email);
    this.loadList();
  }

  balMail(){
    this.hotlineService.setEmail('DA-DAG-achatpedia@edf.fr');
    this.loadList();
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
    this.hotlineSubscription.unsubscribe();
  }

  public onExported(e) {
    this.hotlineService
      .getList({})
      .subscribe(hotlines => {
       this.excelService.generateExcel({header:hotlines.header,data:hotlines.data}, { sheet: 'hotline', name: 'hotlines.xlsx' });
      }
      );
  }
}

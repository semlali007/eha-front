import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { HotlineService } from 'src/app/core/services/hotline.service';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { HotlineListEmailComponent } from '../hotline-list-email/hotline-list-email.component';

@Component({
  selector: 'app-hotline-list',
  templateUrl: './hotline-list.component.html',
  styles: [
  ]
})
export class HotlineListComponent implements OnInit {
  new: [] = [];
  progress: [] = [];
  end: [] = [];
  categories: any = [];
  email: string = '';
  active: string = 'new';
  bsModalRef: BsModalRef;

  constructor(
    private authService: AuthService,
    private hotlineService: HotlineService,
    private modalService: BsModalService
  ) { }

  ngOnInit(): void {
    this.email = this.authService.currentUser.email;
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
    console.log('okok');
    let params: any = { email: this.email };
    if (!!filter && !!filter.category) {
      params.category = filter.category;
    }
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
      actualEmail: this.email,
    };
    this.bsModalRef = this.modalService.show(HotlineListEmailComponent, { initialState });
    this.bsModalRef.content.closeBtnName = 'Fermer';
    this.bsModalRef.content.afterEdit.subscribe(response => {
      if (!!response && !!response.email) {
        this.email = response.email;
        this.loadList();
      }
    });
  }
}

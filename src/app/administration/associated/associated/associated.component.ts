import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { SearchLogService } from 'src/app/core/services/search-log.service';
import {AssociatedFormComponent} from 'src/app/administration/associated/associated-form/associated-form.component';
import {SynonymousFormComponent} from 'src/app/administration/associated/synonymous-form/synonymous-form.component';

import { Observable} from 'rxjs';
 

@Component({
  selector: 'app-associated',
  templateUrl: './associated.component.html',
  styleUrls: ['./associated.component.css']
})
export class AssociatedComponent implements OnInit {
  logs$: Observable<any>;
  bsModalRef?: BsModalRef;
  bsConfirmModalRef?: BsModalRef;
  idToDelete?: number;
  constructor(private modalService: BsModalService,
    private searchLogService: SearchLogService) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(){
    this.logs$ = this.searchLogService.getAssociatedList({type:'home_page'});
  }
  openAdd(id?: number) {
    const initialState = {
      id: id,
      type: 'home_page'
    };
    this.bsModalRef = this.modalService.show(AssociatedFormComponent, {initialState});
    this.bsModalRef.content.closeBtnName = 'Fermer';
    this.bsModalRef.content.afterAdd.subscribe(response => {
      this.loadData();
    });
  }

  openAddSynonyous(id?: number) {
    const initialState = {
      id: id,
      type: 'home_page'
    };
    this.bsModalRef = this.modalService.show(SynonymousFormComponent, {initialState});
    this.bsModalRef.content.closeBtnName = 'Fermer';
    this.bsModalRef.content.afterAdd.subscribe(response => {
      this.loadData();
    });
  }

}

import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { SearchLogService } from 'src/app/core/services/search-log.service';
import {IgnoreFormComponent} from 'src/app/administration/search-ignore/ignore-form/ignore-form.component';

import { Observable} from 'rxjs';
 

@Component({
  selector: 'app-search-ignore',
  templateUrl: './search-ignore.component.html',
  styleUrls: ['./search-ignore.component.css']
})
export class SearchIgnoreComponent implements OnInit {
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
    this.logs$ = this.searchLogService.getIgnoreList({type:'home_page'});
  }
  openAdd(id?: number) {
    const initialState = {
      id: id,
      type: 'home_page'
    };
    this.bsModalRef = this.modalService.show(IgnoreFormComponent, {initialState});
    this.bsModalRef.content.closeBtnName = 'Fermer';
    this.bsModalRef.content.afterAdd.subscribe(response => {
      this.loadData();
    });
  }

  remove($id) {
  
    this.searchLogService
      .removeIgnored({
        id: $id
      })
      .subscribe(response => this.loadData());
    
    }
    confirm(): void {
      this.remove(this.idToDelete);
      this.bsConfirmModalRef?.hide();    
    }
   
    decline(): void {
      this.bsConfirmModalRef?.hide();  }
      openModal(template: TemplateRef<any>, id: number) {
        this.bsConfirmModalRef = this.modalService.show(template, {class: 'modal-sm'});
        this.idToDelete = id;
      }
    
}

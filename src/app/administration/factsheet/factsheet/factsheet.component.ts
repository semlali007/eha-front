import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FactsheetService } from 'src/app/core/services/factsheet.service';
import { Observable} from 'rxjs';
import {FactsheetFormComponent} from 'src/app/administration/factsheet/factsheet-form/factsheet-form.component';

 

@Component({
  selector: 'app-factsheet',
  templateUrl: './factsheet.component.html',
  styleUrls: ['./factsheet.component.css']
})
export class FactsheetComponent implements OnInit {

  factsheets$: Observable<any>;
  bsModalRef?: BsModalRef;
  bsConfirmModalRef?: BsModalRef;
  idToDelete?: number;
  constructor(private modalService: BsModalService,
    private factsheetService: FactsheetService) { }

  ngOnInit(): void {
    this.loadData();
  }
  openAdd(id?: number) {
    const initialState = {
      id: id,
      type: 'home_page'
    };
    this.bsModalRef = this.modalService.show(FactsheetFormComponent, {initialState});
    this.bsModalRef.content.closeBtnName = 'Fermer';
    this.bsModalRef.content.afterAdd.subscribe(response => {
      this.loadData();
    });
  }


  loadData(){
    this.factsheets$ = this.factsheetService.getList({type:'home_page'});
  }


  openModal(template: TemplateRef<any>, id: number) {
    this.bsConfirmModalRef = this.modalService.show(template, {class: 'modal-sm'});
    this.idToDelete = id;
  }

  remove($id) {
  
    this.factsheetService
      .remove({
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

}

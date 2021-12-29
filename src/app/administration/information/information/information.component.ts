import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { InformationService } from 'src/app/core/services/information.service';
import { Observable} from 'rxjs';
import {InformationFormComponent} from 'src/app/administration/information/information-form/information-form.component';

 

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.css']
})
export class InformationComponent implements OnInit {

  informations$: Observable<any>;
  bsModalRef?: BsModalRef;
  bsConfirmModalRef?: BsModalRef;
  idToDelete?: number;
  constructor(private modalService: BsModalService,
    private informationService: InformationService) { }

  ngOnInit(): void {
    this.loadData();
  }
  openAdd(id?: number) {
    const initialState = {
      id: id,
      type: 'home_page'
    };
    this.bsModalRef = this.modalService.show(InformationFormComponent, {initialState});
    this.bsModalRef.content.closeBtnName = 'Fermer';
    this.bsModalRef.content.afterAdd.subscribe(response => {
      this.loadData();
    });
  }


  loadData(){
    this.informations$ = this.informationService.getList({type:'home_page'});
  }


  openModal(template: TemplateRef<any>, id: number) {
    this.bsConfirmModalRef = this.modalService.show(template, {class: 'modal-sm'});
    this.idToDelete = id;
  }

  remove($id) {
  
    this.informationService
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

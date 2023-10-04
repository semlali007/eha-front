import { Component, OnInit, TemplateRef } from '@angular/core';
import { HotlineGroupService } from 'src/app/core/services/hotline-group.service';
import { HotlineGroupFormComponent } from 'src/app/administration/hotline-group/hotline-group-form/hotline-group-form.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-hotline-group',
  templateUrl: './hotline-group.component.html',
  styleUrls: ['./hotline-group.component.css']
})
export class HotlineGroupComponent implements OnInit {
  groups: any = [];
  idToDelete?: string;
  bsModalRef?: BsModalRef;
  bsConfirmModalRef?: BsModalRef;
  constructor(
    private hotlineGroupService: HotlineGroupService,
    private modalService: BsModalService
  ) { }

  ngOnInit(): void {
    this.getList();
  }

  getList() {
    this.groups = [];
    this.hotlineGroupService
      .getList({})
      .subscribe(response => {
        this.groups = response.rows;
      })
  }

  update(group) {
    this.hotlineGroupService
      .update({ id: group.id })
      .subscribe(response => {
        this.getList();
      })
  }
  openAdd(id?: string) {
    const initialState = {
      id: id,
    };
    this.bsModalRef = this.modalService.show(HotlineGroupFormComponent, {initialState});
    this.bsModalRef.content.closeBtnName = 'Fermer';
    this.bsModalRef.content.afterAdd.subscribe(response => {
      this.getList();
    });
  }
  
  remove(id: string) {
    this.hotlineGroupService
      .remove({
        id: id
      })
      .subscribe(response => this.getList());
  }
  confirm(): void {
    this.remove(this.idToDelete);
    this.bsConfirmModalRef?.hide();    
  }
 
  decline(): void {
    this.bsConfirmModalRef?.hide();  
  }

    openModal(template: TemplateRef<any>, id: string) {
      this.bsConfirmModalRef = this.modalService.show(template, {class: 'modal-sm'});
      this.idToDelete = id;
    }
}
import { Component, OnInit, TemplateRef } from '@angular/core';
import { HotlineThemeService } from 'src/app/core/services/hotline-theme.service';
import { HotlineThemeFormComponent } from 'src/app/administration/hotline-theme/hotline-theme-form/hotline-theme-form.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-hotline-theme',
  templateUrl: './hotline-theme.component.html',
  styleUrls: ['./hotline-theme.component.css']
})
export class HotlineThemeComponent implements OnInit {
  themes: any = [];
  idToDelete?: number; 
  bsModalRef?: BsModalRef;
  bsConfirmModalRef?: BsModalRef;

  constructor(
    private hotlineThemeService: HotlineThemeService,
    private modalService: BsModalService
  ) { }

  ngOnInit(): void {
    this.getList();
  }


  getList() {
    this.themes = [];
    this.hotlineThemeService
      .getList({})
      .subscribe(response => {
        this.themes = response.rows;
      })
  }

  update(theme) {
    this.hotlineThemeService
      .update({ id: theme.id })
      .subscribe(response => {
        this.getList();
      })
  }

  openAdd(id?: number) {
    const initialState = {
      id: id,
    };
    this.bsModalRef = this.modalService.show(HotlineThemeFormComponent, {initialState});
    this.bsModalRef.content.closeBtnName = 'Fermer';
    this.bsModalRef.content.afterAdd.subscribe(response => {
      this.getList();
    });
  }

  remove($id) {
    this.hotlineThemeService
      .remove({
        id: $id
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

    openModal(template: TemplateRef<any>, id: number) {
      this.bsConfirmModalRef = this.modalService.show(template, {class: 'modal-sm'});
      this.idToDelete = id;
    }
}

import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NewsService } from 'src/app/core/services/news.service';
import { Observable, pipe } from 'rxjs';
import {NewsAddComponent} from 'src/app/administration/news/news-add/news-add.component';
import { NewsDeleteComponent } from '../news-delete/news-delete.component';
 

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  news$: Observable<any>;
  bsModalRef?: BsModalRef;
  bsConfirmModalRef?: BsModalRef;
  idToDelete?: number;
  constructor(private modalService: BsModalService,
    private newsService: NewsService) { }

  ngOnInit(): void {
    this.loadData();
    console.log(this.newsService.getDate());

  }
  openAdd(id?: number) {
    console.log('id',id);
    const initialState = {
      id: id,
    };
    this.bsModalRef = this.modalService.show(NewsAddComponent, {initialState});
    this.bsModalRef.content.closeBtnName = 'Fermer';
    this.bsModalRef.content.afterAdd.subscribe(response => {
      this.loadData();
    });
  }

  openRemove(id?: number) {
    console.log('id',id);
    const initialState = {
      id: id,
    };
    this.bsModalRef = this.modalService.show(NewsDeleteComponent, {initialState});
    this.bsModalRef.content.closeBtnName = 'Fermer';
    this.bsModalRef.content.afterAdd.subscribe(response => {
      this.loadData();
    });
  }

  loadData(){
    this.news$ = this.newsService.getList();
  }


  openModal(template: TemplateRef<any>, id: number) {
    this.bsConfirmModalRef = this.modalService.show(template, {class: 'modal-sm'});
    this.idToDelete = id;
  }

  remove($id) {
    
    this.newsService
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

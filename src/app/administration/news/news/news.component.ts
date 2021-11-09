import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NewsService } from 'src/app/core/services/news.service';
import { Observable} from 'rxjs';
import {NewsFormComponent} from 'src/app/administration/news/news-form/news-form.component';

 

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
  }
  openAdd(id?: number) {
    const initialState = {
      id: id,
    };
    this.bsModalRef = this.modalService.show(NewsFormComponent, {initialState});
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

import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NewsService } from 'src/app/core/services/news.service';
import { Observable} from 'rxjs';
import {NewsFormComponent} from 'src/app/administration/news/news-form/news-form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { BsDaterangepickerConfig } from 'ngx-bootstrap/datepicker';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageService } from 'src/app/core/services/page.service';

 

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  news$: Observable<any>;
  pageForm: FormGroup;
  bsModalRef?: BsModalRef;
  bsConfirmModalRef?: BsModalRef;
  idToDelete?: number;
  type: string = '';
  title: string = '';
  staticPage: any = null;
  constructor(private modalService: BsModalService,
    private newsService: NewsService,
    private route: ActivatedRoute,private fb: FormBuilder, private pageService: PageService) { }

  ngOnInit(): void {
    this.pageForm = this.fb.group({
      'content': ['', [
        Validators.required
      ]],
      'active': false
    });
    this.route.params.subscribe(params => {
      if (!!params.type) {
        switch(params.type){
          case 'home-page':
          this.type = 'home_page';
          this.title = 'Page d\'accueil';
          this.loadPage();
          break;
          case 'after-connexion':
          this.type = 'after_connexion';
          this.title = 'Première connection';
          break;
        }
        this.loadData();
      }
    });
    
  }
  get content() { return this.pageForm.get('content') }
  get active() { return this.pageForm.get('active') }
  openAdd(id?: number) {
    const initialState = {
      id: id,
      type:this.type
    };
    this.bsModalRef = this.modalService.show(NewsFormComponent, {initialState});
    this.bsModalRef.content.closeBtnName = 'Fermer';
    this.bsModalRef.content.afterAdd.subscribe(response => {
      this.loadData();
    });
  }


  loadData(){
    this.news$ = this.newsService.getList(this.type);
  }
  loadPage() {
    this.pageService.getPage({ page: this.type }).subscribe(response => {
      this.staticPage = response;
      this.pageForm = this.fb.group({
        'content': [response.content, [
          Validators.required
        ]],
        'active': response.active
      });
    })
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

    submit(): void {
      this.pageService
      .update({page:this.type, content:this.content.value, active: this.active.value})
      .subscribe(response=>{
       this.loadPage();
      })
    }

}

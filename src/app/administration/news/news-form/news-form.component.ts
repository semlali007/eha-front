import { Component, OnInit, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { NewsService } from 'src/app/core/services/news.service';


@Component({
  selector: 'app-news-form',
  templateUrl: './news-form.component.html',
  styleUrls: ['./news-form.component.css']
})
export class NewsFormComponent implements OnInit {

  NewsAddForm: FormGroup;

  public afterAdd: EventEmitter<any> = new EventEmitter();
  id:number;
  get title() { return this.NewsAddForm.get('title') }
  get description() { return this.NewsAddForm.get('description') }


  constructor(
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private newsService: NewsService

    ) { }

  ngOnInit(): void {
    this.NewsAddForm = this.fb.group({
      'title': ['', [
        Validators.required,
      ]],
      'description': ['', [
        Validators.required,
      ]],
    });
    if (!!this.id) {
      
      this.newsService.getElement({ id: this.id }).subscribe(response => {
        this.title.setValue(response.title);
        this.description.setValue(response.description);
      })


      }

  }

  submit() {

    let params = {
      'title': this.title.value,
      'description': this.description.value,
      'id': null,
      'date': this.newsService.getDate(),
    }
    if (!!this.id) {

    params.id = this.id;
    this.newsService.updateNews(params).subscribe(response => {
      this.bsModalRef.hide();
      this.afterAdd.emit(response);
    });

    } else {
      this.newsService.addNews(params).subscribe(response => {
        this.bsModalRef.hide();
        this.afterAdd.emit(response);
      });
    }

  }
}

import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { SearchLogService } from 'src/app/core/services/search-log.service';

import { Observable} from 'rxjs';
 

@Component({
  selector: 'app-search-words',
  templateUrl: './search-words.component.html',
  styleUrls: ['./search-words.component.css']
})
export class SearchWordsComponent implements OnInit {
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
    this.logs$ = this.searchLogService.getSearchedList({type:'home_page'});
  }
  

  remove($id) {
  
   
    }
    confirm(): void {
     
    }
   
    decline(): void {
     
      }
    
}

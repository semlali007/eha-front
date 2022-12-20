import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-hotline-list-items',
  templateUrl: './hotline-list-items.component.html',
  styleUrls: ['./hotline-list-items.component.css']
})
export class HotlineListItemsComponent implements OnInit {
  @Input() items: [] = [];
  @Input() filterCode: any;
  paginationForm: FormGroup;
  itemsPerPage: number = 10;
  smallnumPages: number = 0;
  startItem: number = 0;
  endItem: number = 10;

  constructor(private router: Router,
    private fb: FormBuilder,) { }

    get currentPage() { return this.paginationForm.get('currentPage') }


  ngOnInit(): void {
    this.paginationForm = this.fb.group({
      'currentPage': [1],
    });
    
  }

  showHotline(hotline:any){
    let params = ['app/hotline/get', hotline.id];

    if(!!hotline.sha && hotline.sha.length > 0){
      params.push(hotline.sha);
    }

    this.router.navigate(params);
  }

  public pageChanged(event: any): void {
    this.startItem = (event.page - 1) * event.itemsPerPage;
    this.endItem = event.page * event.itemsPerPage;
    this.currentPage.setValue(event.page);
  }

  changePerPage(number: number) {
    this.itemsPerPage = number;
    this.currentPage.setValue(1);
    this.startItem = 0;
    this.endItem = this.itemsPerPage;
  }

}

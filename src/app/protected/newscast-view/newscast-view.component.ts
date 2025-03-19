import { Component, OnInit, OnDestroy, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { NewsCastService } from 'src/app/core/services/newscast.service';
@Component({
  selector: 'app-newscast-view',
  templateUrl: './newscast-view.component.html',
  styleUrls: ['./newscast-view.component.css']
})
export class NewsCastViewComponent implements OnInit, OnDestroy {
  public id: string;
  public next: 0;
  public previous: 0;
  public news: any ={};

  constructor(
    private route: ActivatedRoute,
    private newsCastService: NewsCastService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    
    this.route.params.subscribe(params => {
      if (params.id) {
        this.id = params.id;
        this.newsCastService.get(params.id).subscribe(data => {
          if (!data) return;
          this.news = data;
        });
      }

      if (!!params && !!params.next) {
        this.next = params.next;
      }

      if (!!params && !!params.previous) {
        this.next = params.previous;

      }

    });
  }

  public initSheet(): void {

  }

  public modification(id: string) {
    this.router.navigate([`admin/actualites/modification/${id}`])
  }
  public list() {
    this.router.navigate(
      ['app/actualites']
    );
  }

  confirm(): void {

  }

  decline(): void {
  }

  remove(): void {


  }

  openModal(template: TemplateRef<any>) {
  }

  public showContract(contract) {

  }

  ngOnDestroy() {
  }

  downloadKit(kit) {

  }



  openChange(event: boolean, contractCode: string) {
  }

  isOpened(contract) {
  }

  subscribe(sheetId: number) {
  }
  unsubscribe(sheetId: number) {
  }



}

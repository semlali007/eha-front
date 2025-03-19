import { Component, OnInit, OnDestroy, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { NewsCastService } from 'src/app/core/services/newscast.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
@Component({
  selector: 'app-newscast-view',
  templateUrl: './newscast-view.component.html',
  styleUrls: ['./newscast-view.component.css']
})
export class NewsCastViewComponent implements OnInit, OnDestroy {
  public id: string;
  public news: any = {};
  idToDelete?: number;
  bsConfirmModalRef?: BsModalRef;
  constructor(
    private route: ActivatedRoute,
    private newsCastService: NewsCastService,
    private router: Router,
    private modalService: BsModalService,
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
    });
  }

  public initSheet(): void {

  }

  public modification(id: string) {
    this.router.navigate([`admin/actualites/modification/${id}`])
  }
  public list() {
    this.router.navigate(
      ['admin/actualites']
    );
  }

  remove(): void {
    this.newsCastService
    .remove(
      this.id
    )
    .subscribe(data => this.router.navigate(
      ['admin/actualites']
    ));
  }

  openModal(template: TemplateRef<any>) {
    this.bsConfirmModalRef = this.modalService.show(template, {class: 'modal-sm'});
  }
 
  confirm(): void {
    this.remove();
    this.bsConfirmModalRef?.hide();
  }
 
  decline(): void {
    this.bsConfirmModalRef?.hide();
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

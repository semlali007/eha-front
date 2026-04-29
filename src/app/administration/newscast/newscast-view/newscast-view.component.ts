import { Component, OnInit, OnDestroy, TemplateRef, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NewsCastService } from 'src/app/core/services/newscast.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-newscast-view',
  templateUrl: './newscast-view.component.html',
  styleUrls: [
    './newscast-view.component.css',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class NewsCastViewComponent implements OnInit, OnDestroy {
  public id!: string;
  public news: any = {};
  public bsConfirmModalRef?: BsModalRef;

  constructor(
    private route: ActivatedRoute,
    private newsCastService: NewsCastService,
    private router: Router,
    private modalService: BsModalService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.id = params['id'];
        this.newsCastService.getAdmin(params['id']).subscribe(data => {
          if (!data) return;
          this.news = data;
        });
      }
    });
  }

  public modification(id: string): void {
    this.router.navigate([`admin/actualites/modification/${id}`]);
  }

  public list(): void {
    this.router.navigate(['admin/actualites']);
  }

  remove(): void {
    this.newsCastService.remove(this.id).subscribe(() => this.router.navigate(['admin/actualites']));
  }

  openModal(template: TemplateRef<any>): void {
    this.bsConfirmModalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  confirm(): void {
    this.remove();
    this.bsConfirmModalRef?.hide();
  }

  decline(): void {
    this.bsConfirmModalRef?.hide();
  }

  ngOnDestroy() {}
}

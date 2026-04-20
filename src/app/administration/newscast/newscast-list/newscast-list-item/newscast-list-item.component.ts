import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NewsCastService } from 'src/app/core/services/newscast.service';

@Component({
  selector: 'app-newscast-list-item',
  templateUrl: './newscast-list-item.component.html',
  styleUrls: [
    '../../../admin-shared.css',
    './newscast-list-item.component.css',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class NewsCastListItemComponent implements OnInit {
  @Output() submittedGetSheet = new EventEmitter<Object>();
  @Input() news: any = {};
  @Input() user: any = {};
  status: any;

  constructor(
    private router: Router,
    private newsCastService: NewsCastService,
  ) {}

  ngOnInit() {
    this.status = {
      code: this.news.status,
      label: this.newsCastService.getStatusLabel(this.news.status),
    };
  }

  onSubmittedGetSheet(id: any) {
    this.submittedGetSheet.emit(id);
    this.router.navigate([`admin/actualites/detail/${id}`]);
  }
}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { DateService } from 'src/app/core/services/date.service';
import { Status } from 'src/app/shared/models/status';
import { NewsCastService } from 'src/app/core/services/newscast.service';

@Component({
  selector: 'app-newscast-list-item',
  templateUrl: './newscast-list-item.component.html',
  styleUrls: ['./newscast-list-item.component.css']
})
export class NewsCastListItemComponent implements OnInit {
  @Output() submittedGetSheet = new EventEmitter<Object>();
  @Output() onSubscribe = new EventEmitter<Object>();
  @Input() news: any = {};
  @Input() user: any = {};
  status: any;

  constructor(
    private router: Router,
    private dateService: DateService,
    private newsCastService: NewsCastService,
  ) { }

  ngOnInit() {
    this.status = {
      code: this.news.status,
      label: this.newsCastService.getStatusLabel(this.news.status),
    }
  }

  onSubmittedGetSheet(id) {
    this.submittedGetSheet.emit(id);
    this.router.navigate([`admin/actualites/detail/${id}`]);
  }


  subscribe(sheetId: number){



}
unsubscribe(sheetId: number){


}
}

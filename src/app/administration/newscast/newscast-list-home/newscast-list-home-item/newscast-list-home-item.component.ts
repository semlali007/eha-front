import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { DateService } from 'src/app/core/services/date.service';
import { Status } from 'src/app/shared/models/status';
import { NewsCastService } from 'src/app/core/services/newscast.service';

@Component({
  selector: 'app-newscast-list-home-item',
  templateUrl: './newscast-list-home-item.component.html',
  styleUrls: ['./newscast-list-home-item.component.css']
})
export class NewsCastListHomeItemComponent implements OnInit {
  @Output() submittedGetSheet = new EventEmitter<Object>();
  @Output() onSubscribe = new EventEmitter<Object>();
  @Input() news: any = {};
  @Input() user: any = {};
  status: Status;

  constructor(
    private router: Router,
    private dateService: DateService,
    private newsCastService: NewsCastService,
  ) { }

  ngOnInit() {
  
  }

  onSubmittedGetSheet(id) {
    this.submittedGetSheet.emit(id);
  }


  subscribe(sheetId: number){



}
unsubscribe(sheetId: number){


}
}

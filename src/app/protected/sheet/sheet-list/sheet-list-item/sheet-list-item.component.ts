import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { DateService } from 'src/app/core/services/date.service';
import { Status } from 'src/app/shared/models/status';
import { SheetService } from 'src/app/core/services/sheet.service';

@Component({
  selector: 'app-sheet-list-item',
  templateUrl: './sheet-list-item.component.html',
  styleUrls: ['./sheet-list-item.component.css']
})
export class SheetListItemComponent implements OnInit {
  @Output() submittedGetSheet = new EventEmitter<Object>();
  @Input() comments: String;
  @Input() title: String;
  @Input() date: String;
  @Input() createdAt: String;
  @Input() statusCode: number;
  @Input() id: String;
  @Input() subscribed: Boolean;
  @Input() user: any = {};
  status: Status;

  constructor(
    private router: Router,
    private dateService: DateService,
    private sheetService: SheetService,
  ) { }

  ngOnInit() {
    this.date = this.dateService.getDisplayDateTime(new Date(this.date.slice(0, -3)));
    this.createdAt = this.dateService.getDisplayDateTime(new Date(this.createdAt.slice(0, -3)));
    this.status = new Status({ code: this.statusCode });
  }

  /*getSheet(id: String) {
    this.router.navigate([`app/fiches/details/${id}`]);
  }
*/
  onSubmittedGetSheet(id) {
    this.submittedGetSheet.emit(id);
  }


  subscribe(sheetId: number){
    console.log(sheetId);
    this.sheetService
      .sheetSubscribe({
        sheet: sheetId,
        user: this.user.nni
      }).subscribe((response: any) => {
        this.subscribed = true;
      });


}
unsubscribe(sheetId: number){

  this.sheetService
    .sheetUnsubscribe({
      sheet: sheetId,
      user: this.user.nni
    }).subscribe((response: any) => {

      this.subscribed = false;
    });


}
}

import { Component, OnInit, Input } from '@angular/core';
import { Line } from 'src/app/shared/models/line';
@Component({
  selector: 'app-search-form-line',
  templateUrl: './search-form-line.component.html',
  styleUrls: ['./search-form-line.component.css']
})
export class SearchFormLineComponent implements OnInit {
  @Input() line: any;
  lineList: any;
  constructor() { }

  ngOnInit(): void {
    this.lineList = (new Line()).getLineList();
  }

}

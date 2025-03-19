import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { Line } from 'src/app/shared/models/line';
@Component({
  selector: 'app-search-form-line',
  templateUrl: './search-form-line.component.html',
  styleUrls: ['./search-form-line.component.css']
})
export class SearchFormLineComponent implements OnInit {
  @Output() changedSystemForm = new EventEmitter<void>();
  @Input() line: any;
  lineList: any;
  constructor() { }

  ngOnInit(): void {
    this.lineList = (new Line()).getLineList();
    this.lineList.unshift({
      code: '',
      label: 'tous les mandants PGI',
      tooltip: '',
  });
  }

  changeSystem() {
    this.changedSystemForm.emit();
  }

}

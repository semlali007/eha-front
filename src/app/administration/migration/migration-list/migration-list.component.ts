import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
@Component({
  selector: 'app-migration-list',
  templateUrl: './migration-list.component.html',
  styleUrls: ['./migration-list.component.css']
})
export class MigrationListComponent implements OnInit {
  @Input() list: any = [];
  @Input() type: string = '';
  @Output() submittedMigration = new EventEmitter<Object>();
  constructor(
  ) { }
  ngOnInit(): void {

  }

  migrate() {
    const selected = [];
    let cmt = 0;
    this.list.forEach(item => {
      if (item.isSelected == true && cmt < 60) {
        selected.push(item.id);
        cmt++;
      }
    });

    this.submittedMigration.emit({ type: this.type, items: selected });
  }

  onCheckboxAllChange(e) {
    this.list.forEach(item => {
      if(item.type_d_element != 'success' && item.type_d_element != 'warning'){
        item.isSelected = e.target.checked == true;
      }
      
    })
  }

  onCheckboxChange(e) {
    this.list.forEach(item => {
      if (e.target.value == item.id) {
        item.isSelected = e.target.checked == true;
      }
    })
  }
}

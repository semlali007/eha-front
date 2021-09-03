import { Component, OnInit } from '@angular/core';
import { HotlineGroupService } from 'src/app/core/services/hotline-group.service';

@Component({
  selector: 'app-hotline-group',
  templateUrl: './hotline-group.component.html',
  styleUrls: ['./hotline-group.component.css']
})
export class HotlineGroupComponent implements OnInit {
  groups: any = [];
  constructor(
    private hotlineGroupService: HotlineGroupService,
  ) { }

  ngOnInit(): void {
    this.getList();
  }

  getList() {
    this.groups = [];
    this.hotlineGroupService
      .getList({})
      .subscribe(response => {
        this.groups = response.rows;
      })
  }

  update(group) {
    this.hotlineGroupService
      .update({ id: group.id })
      .subscribe(response => {
        this.getList();
      })
  }
}

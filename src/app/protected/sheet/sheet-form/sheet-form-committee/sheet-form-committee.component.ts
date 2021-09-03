import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Committee } from 'src/app/shared/models/committee';
import { CommitteeService } from 'src/app/core/services/committee.service';
@Component({
  selector: 'app-sheet-form-committee',
  templateUrl: './sheet-form-committee.component.html',
  styles: [
  ]
})
export class SheetFormCommitteeComponent implements OnInit {
  @Input() committeeCode: FormControl;
  committees: Committee[] = [];

  constructor(private committeeService: CommitteeService) { }
  ngOnInit(): void {
    this.committeeService.getList().subscribe(
      committees => {
        this.committees = committees;
      }
    )
  }
}

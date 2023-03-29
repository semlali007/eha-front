import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-nc-form-title',
  templateUrl: './nc-form-title.component.html',
  styles: [
  ]
})
export class NcFormTitleComponent implements OnInit {
  @Input() title: FormControl;
  constructor() { }
  ngOnInit(): void {
  }
}

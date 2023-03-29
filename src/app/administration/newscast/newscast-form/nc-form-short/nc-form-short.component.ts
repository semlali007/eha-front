import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-nc-form-short',
  templateUrl: './nc-form-short.component.html',
  styles: [
  ]
})
export class NcFormShortComponent implements OnInit {
  @Input() short_description: FormControl;
  constructor() { }
  ngOnInit(): void {
  }
}

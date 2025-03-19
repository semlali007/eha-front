import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-nc-form-description',
  templateUrl: './nc-form-description.component.html',
  styles: [
  ]
})
export class NcFormDescriptionComponent implements OnInit {
  @Input() description: FormControl;
  constructor() { }
  ngOnInit(): void {
  }
}


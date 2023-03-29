import { Component, OnInit, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { NewsCastService } from 'src/app/core/services/newscast.service';
@Component({
  selector: 'app-nc-form-home',
  templateUrl: './nc-form-home.component.html',
  styles: [
  ]
})
export class NcFormHomeComponent implements OnInit {
  @Input() is_home: FormControl;
  constructor() { }

  ngOnInit(): void {
  }

}

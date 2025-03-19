import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-hotline-form-entity',
  templateUrl: './hotline-form-entity.component.html',
  styles: [
  ]
})
export class HotlineFormEntityComponent implements OnInit {
  @Input() entity: any;
  constructor() { }
  @Input() hotlineForm: FormGroup;
  ngOnInit(): void {

  }

}

import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';


@Component({
  selector: 'app-hotline-form-question',
  templateUrl: './hotline-form-question.component.html',
  styles: [
  ]
})
export class HotlineFormQuestionComponent implements OnInit {
  @Input() question: any;
  constructor() { }
  @Input() hotlineForm: FormGroup;
  ngOnInit(): void {

  }
}

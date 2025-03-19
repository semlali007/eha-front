import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
@Component({
  selector: 'app-hotline-form-theme',
  templateUrl: './hotline-form-theme.component.html',
  styles: [
  ]
})
export class HotlineFormThemeComponent implements OnInit {
  @Input() theme: any;
  @Input() themesList: any;
  constructor() { }
  @Input() hotlineForm: FormGroup;
  ngOnInit(): void {

  }
}

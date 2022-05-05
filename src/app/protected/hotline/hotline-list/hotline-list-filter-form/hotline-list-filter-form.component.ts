import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
@Component({
  selector: 'app-hotline-list-filter-form',
  templateUrl: './hotline-list-filter-form.component.html',
  styles: [
  ]
})
export class HotlineListFilterFormComponent implements OnInit {
  hotlineFilterForm: FormGroup;
  @Output() submittedFilter = new EventEmitter<Object>();
  @Input() categories: any;
  constructor(
    private fb: FormBuilder,
  ) { }
  get category() { return this.hotlineFilterForm.get('category') as any; }
  ngOnInit(): void {
    this.hotlineFilterForm = this.fb.group({
      category: ['', [Validators.required]],
    });
  }

  changeCategory(e) {
    console.log(e.target.value);
    this.submittedFilter.emit({
      category: e.target.value
    });
  }

  resetForm(){
    this.hotlineFilterForm.reset();
    this.submittedFilter.emit({
      category: ''
    });
  }
}

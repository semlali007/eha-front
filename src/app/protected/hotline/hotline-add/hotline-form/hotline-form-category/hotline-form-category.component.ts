import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-hotline-form-category',
  templateUrl: './hotline-form-category.component.html',
  styles: [
  ]
})
export class HotlineFormCategoryComponent implements OnInit {
  @Input() category: any;
  @Input() familiesList: any;
  @Input() family: any;
  selectedCategories: any;
  constructor() { }
  @Input() hotlineForm: FormGroup;

  ngOnInit(): void {
  }

  changeFamily(e) {
    this.selectedCategories = [];
    this.familiesList.forEach(fam => {
      if (fam.code == e.target.value) {
        fam.categories.forEach(cat => {
          this.selectedCategories.push({
            code: cat.code,
            label: cat.label
          });
        });
      }
    });
  }
}

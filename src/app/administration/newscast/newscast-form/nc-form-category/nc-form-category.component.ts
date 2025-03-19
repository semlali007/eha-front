import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NewsCastService } from 'src/app/core/services/newscast.service';
@Component({
  selector: 'app-nc-form-category',
  templateUrl: './nc-form-category.component.html',
  styles: [
  ]
})
export class NcFormCategoryComponent implements OnInit {
  @Input() categoryId: FormControl;
  categories:[] = [];

  constructor(private newsCastService: NewsCastService) { }
  ngOnInit(): void {
    this.newsCastService.getCategories().subscribe(
      categories => {
        this.categories = categories;
      }
    )
  }
}

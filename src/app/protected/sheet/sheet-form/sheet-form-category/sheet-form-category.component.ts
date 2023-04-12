import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Category } from 'src/app/shared/models/category';
import { CategoryService } from 'src/app/core/services/category.service';
@Component({
  selector: 'app-sheet-form-category',
  templateUrl: './sheet-form-category.component.html',
  styles: [
  ]
})
export class SheetFormCategoryComponent implements OnInit {
  @Input() categoryCode: FormControl;
  categories: Category[] = [];

  constructor(private categoryService: CategoryService) { }
  ngOnInit(): void {
    this.categoryService.getList().subscribe(
      categories => {
        this.categories = categories;
      }
    )
  }
}

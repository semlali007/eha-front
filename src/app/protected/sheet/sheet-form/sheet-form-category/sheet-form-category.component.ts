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
  @Input() mode: 'create' | 'edit' = 'edit'; // Nouveau: mode passé par le parent
  categories: Category[] = [];

  constructor(private categoryService: CategoryService) { }
  ngOnInit(): void {
    this.categoryService.getList().subscribe(
      categories => {
        this.categories = categories;
      }
    )
    
    // Ne charger le localStorage QUE si on n'est PAS en mode création
    if (this.mode !== 'create') {
      const savedCategoryCode = localStorage.getItem('categoryCode');
      if (savedCategoryCode) {
        this.categoryCode.setValue(JSON.parse(savedCategoryCode));
      }
    }

    // Sauvegarder les changements dans localStorage - mais pas en mode création
    this.categoryCode.valueChanges.subscribe(value => {
      if (this.mode !== 'create') {
        localStorage.setItem('categoryCode', JSON.stringify(value));
      }
    });
  }
}

import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sheet-list-filter-category',
  templateUrl: './sheet-list-filter-category.component.html',
  styleUrls: ['./sheet-list-filter-category.component.scss']
})
export class SheetListFilterCategoryComponent implements OnInit, OnChanges, OnDestroy {
  @Input() categories: any = [];
  @Output() changedFilter = new EventEmitter<Object>();
  @Input() list: any = [];
  
  isTotalCollapsed = false;
  isCollapsed = true;
  textButton = 'Voir plus';
  activeFilter = '';
  
  private subscription: Subscription = new Subscription();

  constructor() {}

  ngOnInit() {
    if (this.categories) {
      this.categories.setValue([]);
      
      // Écouter les changements du FormControl pour détecter les réinitialisations
      const valueChanges$ = this.categories.valueChanges.subscribe((value) => {
        if (!value || value.length === 0) {
          this.activeFilter = '';
          this.isTotalCollapsed = true;
        }
      });
      
      this.subscription.add(valueChanges$);
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    // Vérifier si le FormControl categories a changé
    if (changes['categories'] && this.categories) {
      // Surveillance des changements du FormControl
      this.checkFilterState();
    }
  }

  private checkFilterState() {
    if (this.categories && this.categories.value) {
      if (this.categories.value.length > 0) {
        this.isTotalCollapsed = false;
        // Si on a des valeurs mais pas d'activeFilter, on prend la première valeur
        if (!this.activeFilter && this.categories.value.length === 1) {
          this.activeFilter = this.categories.value[0];
        }
      } else {
        // Réinitialisation : remettre à zéro la sélection active
        this.activeFilter = '';
      }
    } else {
      // Cas où categories est null/undefined (réinitialisation)
      this.activeFilter = '';
    }
  }

  changeFilter(code: string) {
    this.activeFilter = code === 'all' ? '' : code;
    const value = code === 'all' ? [] : [code];
    this.categories.setValue(value);
    this.changedFilter.emit({ type: 'categories', value });
  }

  isActive(code: string): boolean {
    return this.activeFilter === code;
  }

  showMore() {
    this.isCollapsed = !this.isCollapsed;
    this.textButton = this.isCollapsed ? 'Voir plus' : 'Voir moins';
  }
}

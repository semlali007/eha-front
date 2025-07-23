import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-sheet-form-title',
  templateUrl: './sheet-form-title.component.html',
  styleUrls: ['./sheet-form-title.component.css']
})
export class SheetFormTitleComponent implements OnInit {
  @Input() title: FormControl;
  @Input() mode: 'create' | 'edit' = 'edit'; // Nouveau: mode passé par le parent
  
  constructor() { }
  
  ngOnInit(): void {
    // Ne restaurer le localStorage QUE si on n'est PAS en mode création
    if (this.mode !== 'create') {
      const savedTitle = localStorage.getItem('title');
      if (savedTitle) {
        this.title.setValue(savedTitle);
      }
    }

    // Sauvegarder seulement si on n'est PAS en mode création
    this.title.valueChanges.subscribe(value => {
      if (this.mode !== 'create') {
        localStorage.setItem('title', value);
      }
    });
  }
}

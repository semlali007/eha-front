import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-sheet-form-words',
  templateUrl: './sheet-form-words.component.html',
  styleUrls: ['./sheet-form-words.component.css']
})
export class SheetFormWordsComponent implements OnInit {
  @Input() words: FormControl;
  @Input() mode: 'create' | 'edit' = 'edit'; // Nouveau: mode passé par le parent
  constructor() { }
  ngOnInit(): void {
    // Ne charger le localStorage QUE si on n'est PAS en mode création
    if (this.mode !== 'create') {
      const savedWords = localStorage.getItem('words');
      if (savedWords) {
        this.words.setValue(JSON.parse(savedWords));
      }
    }

    // Sauvegarder les changements dans localStorage - mais pas en mode création
    this.words.valueChanges.subscribe(value => {
      if (this.mode !== 'create') {
        localStorage.setItem('words', JSON.stringify(value));
      }
    });
  }
}

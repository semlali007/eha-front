import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-sheet-form-comments',
  templateUrl: './sheet-form-comments.component.html',
  styleUrls: ['./sheet-form-comments.component.css']
})
export class SheetFormCommentsComponent implements OnInit {
  @Input() comments: FormControl;
  @Input() mode: 'create' | 'edit' = 'edit'; // Nouveau: mode passé par le parent
  constructor() { }
  ngOnInit(): void {
    // Ne charger le localStorage QUE si on n'est PAS en mode création
    if (this.mode !== 'create') {
      const savedComments = localStorage.getItem('comments');
      if (savedComments) {
        this.comments.setValue(savedComments);
      }
    }

    // Sauvegarder les changements dans localStorage - mais pas en mode création
    this.comments.valueChanges.subscribe(value => {
      if (this.mode !== 'create') {
        localStorage.setItem('comments', value);
      }
    });
  }
}


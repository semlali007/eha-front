import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-sheet-form-mise-a-jour-donnee',
  templateUrl: './sheet-form-mise-a-jour-donnee.component.html',
  styleUrls: ['./sheet-form-mise-a-jour-donnee.component.scss']
})
export class SheetFormMiseAJourDonneeComponent implements OnInit {

  @Input() miseAJourDonnee: FormControl;

  constructor() { }

  ngOnInit(): void {
    // Ensure FormControl exists
    if (!this.miseAJourDonnee) {
      console.warn('miseAJourDonnee FormControl not provided');
    }
  }

}

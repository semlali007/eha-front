import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-sheet-form-contrat-groupe',
  templateUrl: './sheet-form-contrat-groupe.component.html',
  styleUrls: ['./sheet-form-contrat-groupe.component.scss']
})
export class SheetFormContratGroupeComponent implements OnInit {

  @Input() contratGroupe: FormControl;

  constructor() { }

  ngOnInit(): void {
  }

}
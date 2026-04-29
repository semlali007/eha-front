import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-sheet-form-contrat-groupe',
  templateUrl: './sheet-form-contrat-groupe.component.html',
  styleUrls: ['./sheet-form-contrat-groupe.component.scss'],
})
export class SheetFormContratGroupeComponent implements OnInit {

  @Input() contratGroupe!: FormControl;

  constructor() {}

  ngOnInit(): void {}

  get isOn(): boolean {
    const v = this.contratGroupe?.value;
    return v === 'true' || v === true;
  }

  onToggle(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.contratGroupe?.setValue(checked ? 'true' : 'false');
    this.contratGroupe?.markAsDirty();
  }
}

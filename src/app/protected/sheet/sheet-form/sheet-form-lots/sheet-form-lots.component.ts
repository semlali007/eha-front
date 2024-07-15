import { Component, OnInit, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-sheet-form-lots',
  templateUrl: './sheet-form-lots.component.html',
  styles: [
  ]
})
export class SheetFormLotsComponent implements OnInit {
  @Input() lots: FormArray;
  @Input() sheetForm: FormGroup;
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    const savedLots = localStorage.getItem('lots');
    if (savedLots) {
      const parsedLots = JSON.parse(savedLots);
      parsedLots.forEach((lot: any) => {
        const lotGroup = this.fb.group({
          name: lot.name,
          description: lot.description
        });
        this.lots.push(lotGroup);
      });
    }
    
    let latestLots: any[];
    this.lots.valueChanges.subscribe(value => {
      if (value !== null && value !== undefined) {
        latestLots = value;
      }
    });

    if (latestLots !== undefined) {
      localStorage.setItem('lots', JSON.stringify(latestLots));
    }
  }

  onAddedLot() {
    const lotGroup = this.fb.group({
      'name': '',
      'description': ''
    });
    this.lots.push(lotGroup);
  }

  onRemovedLot(index: number) {
    this.lots.removeAt(index);
  }
}

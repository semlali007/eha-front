import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Committee } from 'src/app/shared/models/committee';
import { CommitteeService } from 'src/app/core/services/committee.service';
@Component({
  selector: 'app-sheet-form-committee',
  templateUrl: './sheet-form-committee.component.html',
  styleUrls: ['./sheet-form-committee.component.css']
})
export class SheetFormCommitteeComponent implements OnInit {
  @Input() committeeCode: FormControl;
  @Input() mode: 'create' | 'edit' = 'edit'; // Nouveau: mode passé par le parent
  committees: Committee[] = [];

  constructor(private committeeService: CommitteeService) { }
  ngOnInit(): void {
    this.committeeService.getList().subscribe(
      committees => {
        this.committees = committees;
      }
    )
    
    // Ne charger le localStorage QUE si on n'est PAS en mode création
    if (this.mode !== 'create') {
      const savedCommitteeCode = localStorage.getItem('committeeCode');
      if (savedCommitteeCode) {
        this.committeeCode.setValue(JSON.parse(savedCommitteeCode));
      }
    }

    // Sauvegarder les changements dans localStorage - mais pas en mode création
    this.committeeCode.valueChanges.subscribe(value => {
      if (this.mode !== 'create') {
        localStorage.setItem('committeeCode', JSON.stringify(value));
      }
    });
  }
}

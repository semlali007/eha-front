import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-sheet-form-geographic-detail',
  templateUrl: './sheet-form-geographic-detail.component.html',
  styleUrls: ['./sheet-form-geographic-detail.component.css']
})
export class SheetFormGeographicDetailComponent {
  @Input() sheetForm: FormGroup;
}

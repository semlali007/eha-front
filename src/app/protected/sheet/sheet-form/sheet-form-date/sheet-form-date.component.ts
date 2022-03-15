import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { SheetService } from 'src/app/core/services/sheet.service';
@Component({
  selector: 'app-sheet-form-date',
  templateUrl: './sheet-form-date.component.html',
  styles: [
  ]
})
export class SheetFormDateComponent implements OnInit {
  @Input() startDate: FormControl;
  @Input() endDate: FormControl;
  @Input() sheetForm: FormGroup;
  constructor(private localeService: BsLocaleService,
    private sheetService: SheetService) { }
  ngOnInit(): void {
    this.localeService.use('fr');
  }
  onValueChange(value: Date): void {
    this.sheetForm.get('endDate').setValue(value);
    this.sheetService.sheetValidate(this.sheetForm);
  
  }
  onChange(event) {
		this.sheetService.sheetValidate(this.sheetForm);
   
  }
}

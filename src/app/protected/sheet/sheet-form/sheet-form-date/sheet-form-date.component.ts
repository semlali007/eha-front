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
    const savedStartDate = localStorage.getItem('startDate');
  if (savedStartDate) {
    this.startDate.setValue(new Date(savedStartDate));
  }

  const savedEndDate = localStorage.getItem('endDate');
  if (savedEndDate) {
    this.endDate.setValue(new Date(savedEndDate));
  }

  this.startDate.valueChanges.subscribe(value => {
    localStorage.setItem('startDate', value.toISOString());
  });

  this.endDate.valueChanges.subscribe(value => {
    localStorage.setItem('endDate', value.toISOString());
  });
  }
  onValueChange(value: Date): void {
    if(!!value){
      this.sheetForm.get('endDate').setValue(value);
    }
    this.sheetService.sheetValidate(this.sheetForm);
  }

}

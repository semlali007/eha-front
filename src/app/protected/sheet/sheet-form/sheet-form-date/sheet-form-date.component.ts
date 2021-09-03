import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
@Component({
  selector: 'app-sheet-form-date',
  templateUrl: './sheet-form-date.component.html',
  styles: [
  ]
})
export class SheetFormDateComponent implements OnInit {
  @Input() startDate: FormControl;
  @Input() endDate: FormControl;
  constructor(private localeService: BsLocaleService) { }
  ngOnInit(): void {
    this.localeService.use('fr');
  }
}

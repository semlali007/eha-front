import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-sheet-list-filter-provider',
  templateUrl: './sheet-list-filter-provider.component.html',
  styles: [
  ]
})

export class SheetListFilterProviderComponent implements OnInit, OnChanges {

  @Input() providers: any = [];
  @Output() changedFilter = new EventEmitter<Object>();
  @Input() list: any = [];

  myForm: FormGroup;
  constructor(private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.myForm = this.fb.group({
      'state': [''],
    });
  }

  deleteOneProvider(providerCode: any) {
    this.providers.value.forEach((element, index) => {
      if (element.code === providerCode) {
        this.providers.value.splice(index, 1);
      }
    });
    this.changedFilter.emit({
      type: 'providers',
      value: this.providers.value
    });
  }

  ngOnChanges(): void {
  }

  onSelect(event) {
    let code = event.item.code;
    let exist = false;
    this.providers.value.forEach(element => {
      if (element.code === code) {
        exist = true;
      }
    });

    if (exist === false) {
      this.providers.value.push(event.item);
    }
    this.myForm.reset();
    this.changedFilter.emit({
      type: 'providers',
      value: this.providers.value
    });
  }
}

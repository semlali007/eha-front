import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChange } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';


@Component({
  selector: 'app-sheet-list-filter-beneficiary',
  templateUrl: './sheet-list-filter-beneficiary.component.html',
  styles: [
  ]
})

export class SheetListFilterBeneficiaryComponent implements OnInit {

  @Input() beneficiaries: any = [];
  @Input() data: any;
  @Output() changedFilter = new EventEmitter<Object>();
  @Input() list: any = [];
  myForm: FormGroup;
  isCollapsed = true;
  isTotalCollapsed = false;
  textButton = "Afficher plus";
  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      'state': [''],
    });
  }

  OnChange(change:SimpleChange): void {
    console.log(change);
    if(this.data.length > 0) {
      this.data.forEach(element => {
        this.beneficiaries.value.push(element);
        console.log("test");
      });
    }
  }

  onSelect(event) {
    let code = event.item.code;
    let exist = false;
    this.beneficiaries.value.forEach(element => {
      if (element.code === code) {
        exist = true;
      }
    });

    if (exist === false) {
      this.beneficiaries.value.push(event.item);
    }
    this.myForm.reset();
    this.changedFilter.emit({
      type: 'beneficiaries',
      value: this.beneficiaries.value
    });

    console.log(this.data)

  }

  deleteOneBeneficiary(providerCode: any) {
    this.beneficiaries.value.forEach((element, index) => {
      if (element.code === providerCode) {
        this.beneficiaries.value.splice(index, 1);
      }
    });
    this.changedFilter.emit({
      type: 'beneficiaries',
      value: this.beneficiaries.value
    });
  }

  public isActive(code): boolean {
    return this.beneficiaries.value.includes(code);
  }

  public showMore() {
    this.textButton = (this.isCollapsed == false) ? "Afficher plus" : "Afficher moins";
    this.isCollapsed = !this.isCollapsed;

  }
}

import { Component, OnInit, Input, Output, EventEmitter, OnChanges} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';


@Component({
  selector: 'app-sheet-list-filter-beneficiary',
  templateUrl: './sheet-list-filter-beneficiary.component.html',
  styles: [
  ]
})

export class SheetListFilterBeneficiaryComponent implements OnInit, OnChanges {

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

  ngOnChanges(): void {
    this.beneficiaries.value.forEach((item, key) => {
      let removed = this.removeFromList(item);
      if(!!removed){
        this.beneficiaries.value[key]=removed;
      }
    })
  }


  removeFromList(element) {
    let result = this.list.find(obj => {
      return obj.code === element.code
    });
    if (result && this.list.indexOf(result) >= 0) {
      this.list.splice(this.list.indexOf(result), 1);
      return result;
    }
    return null;
  }

  onSelect(event) {

    this.beneficiaries.value.push(event.item);
    this.myForm.reset();
    this.changedFilter.emit({
      type: 'beneficiaries',
      value: this.beneficiaries.value
    });
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

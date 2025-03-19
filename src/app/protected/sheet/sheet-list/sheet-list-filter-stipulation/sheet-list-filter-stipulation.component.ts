import { Component, OnInit, Input, Output, EventEmitter, OnChanges} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';


@Component({
  selector: 'app-sheet-list-filter-stipulation',
  templateUrl: './sheet-list-filter-stipulation.component.html',
  styles: [
  ]
})

export class SheetListFilterStipulationComponent implements OnInit, OnChanges {

  @Input() stipulationAutrui: any = [];
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
    this.stipulationAutrui.value.forEach((item, key) => {
      let removed = this.removeFromList(item);
      if(!!removed){
        this.stipulationAutrui.value[key]=removed;
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

    this.stipulationAutrui.value.push(event.item);
    this.myForm.reset();
    this.changedFilter.emit({
      type: 'stipulationAutrui',
      value: this.stipulationAutrui.value
    });
  }

  deleteOneStipulation(providerCode: any) {
    this.stipulationAutrui.value.forEach((element, index) => {
      if (element.code === providerCode) {
        this.stipulationAutrui.value.splice(index, 1);
      }
    });
    this.changedFilter.emit({
      type: 'stipulationAutrui',
      value: this.stipulationAutrui.value
    });
  }

  public isActive(code): boolean {
    return this.stipulationAutrui.value.includes(code);
  }

  public showMore() {
    this.textButton = (this.isCollapsed == false) ? "Afficher plus" : "Afficher moins";
    this.isCollapsed = !this.isCollapsed;

  }
}

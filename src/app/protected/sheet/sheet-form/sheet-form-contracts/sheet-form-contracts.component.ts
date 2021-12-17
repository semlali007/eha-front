import { Component, OnInit, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
@Component({
  selector: 'app-sheet-form-contracts',
  templateUrl: './sheet-form-contracts.component.html',
  styles: [
  ]
})
export class SheetFormContractsComponent implements OnInit {
  @Input() contracts: FormArray;
  @Input() sheetForm: FormGroup;
  @Input() lotsList: FormControl;
  currentIndex:number;
  
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {

  }

  onOpenClose(data:any) {
    if(data.index == this.currentIndex) {
      this.currentIndex = -1;
    } else {
      this.currentIndex = data.index;
    }
  }

  onAddedContract() {
    const contractGroup = this.fb.group({
      'code': ['', [
				Validators.required,
				Validators.minLength(9),
				Validators.maxLength(10),
			  Validators.pattern('^[C]{1}[a-zA-Z0-9]*$')
			]],
      'provider': '',
      'lots': [[]],
      'contacts': '',
      
    },
    
   );
    this.contracts.push(contractGroup);
  }

   onRemovedContract(index: number) {
    this.contracts.removeAt(index);
   }

   isActive(index):boolean {
    return index == this.currentIndex;
  }

}

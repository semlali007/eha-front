// import { Component, OnInit, Input } from '@angular/core';
// import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

// @Component({
//   selector: 'app-sheet-form-lots',
//   templateUrl: './sheet-form-lots.component.html',
//   styles: [
//   ]
// })
// export class SheetFormLotsComponent implements OnInit {
//   @Input() lots: FormArray;
//   @Input() sheetForm: FormGroup;
//   constructor(private fb: FormBuilder) { }

//   ngOnInit(): void {
//   }

//   onAddedLot() {
//     const lotGroup = this.fb.group({
//       'name': '',
//       'description': ''
//     });
//     this.lots.push(lotGroup);
//   }

//   onRemovedLot(index: number) {
//     this.lots.removeAt(index);
//   }
// }
import { Component, OnInit, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import * as XLSX from 'xlsx'; 

interface ExcelDataRow {
  name: string;
  description: string;
  
}

@Component({
  selector: 'app-sheet-form-lots',
  templateUrl: './sheet-form-lots.component.html',
  styles: [
  ]
})
export class SheetFormLotsComponent implements OnInit {
  @Input() lots: FormArray;
  @Input() sheetForm: FormGroup;
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
  }

  onAddedLot() {
    const lotGroup = this.fb.group({
      'name': '',
      'description': ''
    });
    this.lots.push(lotGroup);
  }

  onRemovedLot(index: number) {
    this.lots.removeAt(index);
  }
  handleFileInput(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const workbook = XLSX.read(e.target.result, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const data = XLSX.utils.sheet_to_json(worksheet, { raw: true }) as ExcelDataRow[];

        while (this.lots.length > 0) {
          this.lots.removeAt(0);
        }

        data.forEach((row) => {
          const lotGroup = this.fb.group({
            'name': row.name,
            'description': row.description
          });

          this.lots.push(lotGroup);
          console.log("les Lots", this.lots);
        });
      };

      reader.readAsBinaryString(file);
    }
  }
}

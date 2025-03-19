import { Component, OnInit, Input } from '@angular/core';
import { FileService } from 'src/app/core/services/file.service';
import { ExcelService } from 'src/app/core/services/excel.service';
@Component({
  selector: 'app-sheet-list-export',
  templateUrl: './sheet-list-export.component.html',
  styles: [
  ]
})

export class SheetListExportComponent implements OnInit {

  @Input() params: any = {};

  constructor(
    private fileService: FileService,
    private excelService: ExcelService,
  ) {
  }

  ngOnInit(): void {
  }

  export() {
    this.fileService.export(this.params).subscribe((response: any) => {
      this.excelService.generateExcel(response.sheets, { sheet: 'fiches', name: 'fiches' });
    });
  }
}

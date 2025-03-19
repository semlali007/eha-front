import { Component, OnInit, Input } from '@angular/core';
import { FileService } from 'src/app/core/services/file.service';
import { ExcelService } from 'src/app/core/services/excel.service';
@Component({
  selector: 'app-sheet-list-showcase',
  templateUrl: './sheet-list-showcase.component.html',
  styles: [
  ]
})

export class SheetListShowcaseComponent implements OnInit {

  @Input() params: any = {};
  constructor(
    private fileService: FileService,
    private excelService: ExcelService,
  ) {
  }

  ngOnInit(): void {
  }

  export() {
    const params = {
      search: {
        showcase: true,
        status: this.params.search.status,
      }
    };

    this.fileService.export(params).subscribe((response: any) => {
      this.excelService.generateExcel(response.sheets, {sheet:'fiches', name:'vitrine de l\'offre'});
    });
  }
}

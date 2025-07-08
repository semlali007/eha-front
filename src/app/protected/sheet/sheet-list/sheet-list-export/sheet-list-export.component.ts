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
  isExporting: boolean = false;

  constructor(
    private fileService: FileService,
    private excelService: ExcelService,
  ) {
  }

  ngOnInit(): void {
  }

  export() {
    this.isExporting = true;
    
    // Créer un nom de fichier avec horodatage : fiches_DD_MM_YYYY_HHhMM
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const timestamp = `${day}_${month}_${year}_${hours}h${minutes}`;
    const fileName = `fiches_${timestamp}`;
    
    this.fileService.export(this.params).subscribe({
      next: (response: any) => {
        this.excelService.generateExcel(response.sheets, { sheet: 'fiches', name: fileName });
        this.isExporting = false;
      },
      error: (error) => {
        console.error('Erreur lors de l\'export:', error);
        this.isExporting = false;
      }
    });
  }
}

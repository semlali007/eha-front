import { Injectable } from '@angular/core';
import { Workbook } from "exceljs/dist/exceljs.min.js";
import * as fs from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor() { }
  public generateExcel(data, options: {
    sheet?: string,
    name?: string,
} = {}) {
    const header = data.header;
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet(options.sheet || '');
    
    // Ajouter la ligne d'en-tête
    const headerRow = worksheet.addRow(header);
    
    // Styliser les en-têtes
    headerRow.eachCell((cell, colNumber) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4472C4' } // Bleu professionnel
      };
      cell.font = {
        color: { argb: 'FFFFFFFF' }, // Texte blanc
        bold: true,
        size: 12
      };
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center',
        wrapText: true
      };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FF000000' } },
        left: { style: 'thin', color: { argb: 'FF000000' } },
        bottom: { style: 'thin', color: { argb: 'FF000000' } },
        right: { style: 'thin', color: { argb: 'FF000000' } }
      };
    });
    
    // Définir la hauteur de la ligne d'en-tête
    headerRow.height = 30;
    
    // Ajouter les données
    let rowIndex = 2; // Commencer à la ligne 2 (après l'en-tête)
    data.data.forEach(d => {
      const line = [];
      if (Array.isArray(d)) {
        // Si d est déjà un tableau
        line.push(...d);
      } else {
        // Si d est un objet
        for (let key of Object.keys(d)) {
          line.push(d[key]);
        }
      }
      
      const dataRow = worksheet.addRow(line);
      
      // Styliser les lignes de données avec alternance de couleurs
      dataRow.eachCell((cell, colNumber) => {
        // Couleur de fond alternée
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: rowIndex % 2 === 0 ? 'FFF2F2F2' : 'FFFFFFFF' } // Gris clair / Blanc
        };
        
        cell.font = {
          size: 11
        };
        
        cell.alignment = {
          vertical: 'middle',
          horizontal: 'left',
          wrapText: true
        };
        
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFD3D3D3' } },
          left: { style: 'thin', color: { argb: 'FFD3D3D3' } },
          bottom: { style: 'thin', color: { argb: 'FFD3D3D3' } },
          right: { style: 'thin', color: { argb: 'FFD3D3D3' } }
        };
      });
      
      // Définir la hauteur des lignes de données
      dataRow.height = 25;
      rowIndex++;
    });
    
    // Ajuster automatiquement la largeur des colonnes
    worksheet.columns.forEach((column, index) => {
      let maxLength = 0;
      
      // Calculer la largeur basée sur le contenu
      worksheet.getColumn(index + 1).eachCell({ includeEmpty: false }, (cell) => {
        const columnLength = cell.value ? cell.value.toString().length : 0;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
      
      // Définir une largeur minimale et maximale
      const minWidth = 10;
      const maxWidth = 50;
      column.width = Math.min(Math.max(maxLength + 2, minWidth), maxWidth);
    });
    
    // Figer la première ligne (en-têtes)
    worksheet.views = [
      { state: 'frozen', ySplit: 1 }
    ];
    
    // Générer et télécharger le fichier
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, options.name || '');
    });
  }

  public readExcel(event) {
    const content = [];
    const wb = new Workbook();
    const reader = new FileReader()
    reader.readAsArrayBuffer(event.target.files[0])
    reader.onload = () => {
      const buffer = reader.result;
      wb.xlsx.load(buffer).then(workbook => {
        workbook.eachSheet((sheet, id) => {
          sheet.eachRow((row, rowIndex) => {
            let tt = row.values;
            if(tt[0] == null || tt[0].length == 0){
            tt.shift();
            }
            
            content.push(tt);
          })
        })
      })
    }
   return content;
  }

  public exportToCsv(rows: object[], fileName: string, columns?: string[]): string {
    if (!rows || !rows.length) {
      return;
    }
    const separator = ';';
    const keys = Object.keys(rows[0]).filter(k => {
      if (columns?.length) {
        return columns.includes(k);
      } else {
        return true;
      }
    });

    const csvContent =
      keys.join(separator) +
      '\n' +
      rows.map(row => {
        return keys.map(k => {
          let cell = row[k] === null || row[k] === undefined ? '' : row[k];
          cell = cell instanceof Date
            ? cell.toLocaleString()
            : cell.toString().replace(/"/g, '""');
          //if (cell.search(/("|,|\n)/g) >= 0) {
            cell = `"${cell}"`;
          //}
          return cell;
        }).join(separator);
      }).join('\n');
    this.saveAsFile(csvContent, `${fileName}`, 'CSV');
  }
  private saveAsFile(buffer: any, fileName: string, fileType: string): void {
    const data: Blob = new Blob([buffer], { type: fileType });
    fs.saveAs(data, fileName);
  }

  public exportToJson(rows: object[], fileName: string, columns?: string[]): string {
    if (!rows || !rows.length) {
      return;
    }
   
    this.saveAsFile(JSON.stringify(rows), `${fileName}`, 'json');
  }
}

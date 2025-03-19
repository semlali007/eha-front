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
    worksheet.addRow(header);
    data.data.forEach(d => {
      const line = [];
      for (let key of Object.keys(d)) {
        line.push(d[key]);
      }
      worksheet.addRow(line);
    }
    );
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

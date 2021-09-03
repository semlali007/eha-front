import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DownloadFileService {
    constructor( ) { };

    downloadCSV(dataAsCSV:any) {  
        let downloadLink:any;
        let dataType = 'application/vnd.ms-excel';
        // filename
        let filename = 'data.xls';
        // new link
        downloadLink = document.createElement("a");
        document.body.appendChild(downloadLink);
        // Create a link to the file
        downloadLink.href = 'data:' + dataType + ', ' + encodeURI(dataAsCSV);
        // Setting the file name
        downloadLink.download = filename;
        //triggering the function
        downloadLink.click();
    }
}
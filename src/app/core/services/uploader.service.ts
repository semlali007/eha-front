import { Injectable } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class UploaderService {
  uploader: FileUploader;
  constructor() {
  }

  public initKit():  FileUploader{
    return new FileUploader({
      url: `${environment.api.auth.baseURL}/sheet/upload.php`,
      disableMultipart: true,
      formatDataFunctionIsAsync: true,
      formatDataFunction: async (item) => {
        return new Promise((resolve, reject) => {
          resolve({
            name: item._file.name,
            length: item._file.size,
            contentType: item._file.type,
            date: new Date()
          });
        });
      }
    });
  }
}

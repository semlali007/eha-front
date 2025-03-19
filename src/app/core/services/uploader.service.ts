import { Injectable } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { AppConfigService } from 'src/app/core/services/app-config.service';
@Injectable({
  providedIn: 'root'
})
export class UploaderService {
  uploader: FileUploader;
  constructor(private appConfigService: AppConfigService,) {
  }

  public initKit():  FileUploader{
    return new FileUploader({
      url: `${this.appConfigService.basePath}/sheet/upload.php`,
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

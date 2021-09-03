import { FileUploader } from 'ng2-file-upload';
import { Component, EventEmitter, Output, Input } from '@angular/core';
import * as fileSaver from 'file-saver';
import { FileService } from 'src/app/core/services/file.service';

@Component({
  selector: 'app-sheet-form-kit',
  templateUrl: './sheet-form-kit.component.html',
  styles: [
  ]
})
export class SheetFormKitComponent {
  @Output() removedItem = new EventEmitter<void>();
  @Input() uploader: FileUploader;
  @Input() label: string = '';
  constructor(private fileService: FileService,) {
  }

  onRemove(item: any) {

    if (!!item && !!item.options && !!item.options.additionalParameter && !!item.options.additionalParameter.document) {
      this.removedItem.emit(item.options.additionalParameter.document);
    }
  }


  download(kit) {
    this.fileService.sheetDocument({ url: kit.url }).subscribe((response: any) => {
      let blob: any = new Blob([response]);
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob, kit.name);
      }
      else {
        const url = window.URL.createObjectURL(blob);
        fileSaver.saveAs(blob, kit.name);
      };
    });
  }
}
import { FileUploader } from 'ng2-file-upload';
import { Component, EventEmitter, Output, Input, TemplateRef, ViewChild} from '@angular/core';
import * as fileSaver from 'file-saver';
import { FileService } from 'src/app/core/services/file.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { environment } from 'src/environments/environment';


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
  @ViewChild('template') template: TemplateRef<any>;
  bsModalRef?: BsModalRef;
  showModal: boolean = false;
  maxsize = environment.maxuploadsize || 10000000;
  constructor(private fileService: FileService,
    private modalService: BsModalService,) {
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

  upload(){
    this.uploader?.queue?.forEach((element,index) => {
      if(element?.file?.size > this.maxsize)
      {
        this.uploader.queue.splice(index);
        this.showModal = true;
      }
    })
    if(this.showModal)
      this.bsModalRef =  this.modalService.show(this.template, {class: 'modal-sm'});

    this.showModal = false;
  }

  confirm(){
    this.bsModalRef?.hide();  
  }
}
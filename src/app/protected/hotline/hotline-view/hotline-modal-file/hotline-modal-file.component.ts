import { Component, EventEmitter, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { HotlineService } from 'src/app/core/services/hotline.service';

@Component({
  selector: 'app-hotline-modal-file',
  templateUrl: './hotline-modal-file.component.html',
  styles: [
  ]
})
export class HotlineModalFileComponent implements OnInit {
  id: string = '';
  sha: string = '';
  fileForm: FormGroup;
  public fileEvent: EventEmitter<any> = new EventEmitter();
  constructor(
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private hotlineService: HotlineService,
  ) { }
  get name() { return this.fileForm.get('name') }
  get file() { return this.fileForm.get('file') }
  ngOnInit(): void {
    this.fileForm = this.fb.group({
      'name': ['', [
        Validators.required
      ]],
      file: new FormControl('', [Validators.required]),
      fileSource: new FormControl('', [Validators.required])
    });
  }

  submit(): void {
    const params = {
      id: this.id,
      sha: this.sha,
      name: this.name.value,
      file: this.fileForm.get('fileSource').value
    }
    
    this.hotlineService.addFile(params).subscribe(response => {
      this.bsModalRef.hide();
      this.fileEvent.emit(response);
    })
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.fileForm.patchValue({
        fileSource: file
      });
    }
  }
}

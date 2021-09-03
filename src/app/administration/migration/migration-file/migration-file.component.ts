import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ExcelService } from 'src/app/core/services/excel.service';
@Component({
  selector: 'app-migration-file',
  templateUrl: './migration-file.component.html',
  styleUrls: ['./migration-file.component.css']
})
export class MigrationFileComponent implements OnInit {
  fileForm: FormGroup;
  content = [];
  @Input() type: string = '';
  @Output() submittedForm = new EventEmitter<Object>();
  constructor(
    private fb: FormBuilder,
    private excelService: ExcelService
  ) { }
  get file() { return this.fileForm.get('file') }
  ngOnInit(): void {
    this.fileForm = this.fb.group({
      file: new FormControl('', [Validators.required]),
      fileSource: new FormControl('', [Validators.required])
    });
  }

  submit() {
    const params = {
      type: this.type,
      file: this.fileForm.get('fileSource').value,
      content: this.content
    }
    this.submittedForm.emit(params);
  }

  onFileChange(event) {
    this.content = this.excelService.readExcel(event);
   // ;return;
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.fileForm.patchValue({
        fileSource: file
      });
    }
  }
  
}

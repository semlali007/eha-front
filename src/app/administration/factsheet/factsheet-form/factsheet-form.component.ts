import { Component, OnInit, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';
import { FactsheetService } from 'src/app/core/services/factsheet.service';

@Component({
  selector: 'app-factsheet-form',
  templateUrl: './factsheet-form.component.html',
  styleUrls: ['./factsheet-form.component.css']
})
export class FactsheetFormComponent implements OnInit {

  factsheetAddForm: FormGroup;
  public afterAdd: EventEmitter<any> = new EventEmitter();
  id: number;
  get title() { return this.factsheetAddForm.get('title') }
  get file() { return this.factsheetAddForm.get('file') }
  constructor(
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private factsheetService: FactsheetService

  ) { }

  ngOnInit(): void {
    this.factsheetAddForm = this.fb.group({
      'title': ['', [
        Validators.required,
      ]],
      file: new FormControl('', [Validators.required]),
      fileSource: new FormControl('', [Validators.required])
    });
    if (!!this.id) {
      this.factsheetService.getElement({ id: this.id }).subscribe(response => {
        this.factsheetAddForm = this.fb.group({
          'title': [response.name, [
            Validators.required,
          ]],
          file: new FormControl(response.file_name, [Validators.required]),
          fileSource: new FormControl('', [Validators.required])
        });

      })
    }
  }


  submit(): void {
    const params = {
      id: this.id,
      title: this.title.value,
      file: this.factsheetAddForm.get('fileSource').value
    }

    if (!!this.id) {
      params.id = this.id;
      this.factsheetService.updatefactsheet(params).subscribe(response => {
        this.bsModalRef.hide();
        this.afterAdd.emit(response);
      });
      } else {
        this.factsheetService.addfactsheet(params).subscribe(response => {
          this.bsModalRef.hide();
          this.afterAdd.emit(response);
        });
      }
  }


  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.factsheetAddForm.patchValue({
        fileSource: file
      });
    }
  }

}

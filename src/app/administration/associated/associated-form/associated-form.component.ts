import { Component, OnInit, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';
import { SearchLogService } from 'src/app/core/services/search-log.service';

@Component({
  selector: 'app-associated-form',
  templateUrl: './associated-form.component.html',
  styleUrls: ['./associated-form.component.css']
})
export class AssociatedFormComponent implements OnInit {

  factsheetAddForm: FormGroup;
  public afterAdd: EventEmitter<any> = new EventEmitter();
  id: number;
  get title() { return this.factsheetAddForm.get('title') }
  get file() { return this.factsheetAddForm.get('file') }
  constructor(
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private searchLogService: SearchLogService

  ) { }

  ngOnInit(): void {
    this.factsheetAddForm = this.fb.group({
      'title': ['', [
        Validators.required,
      ]],
    });
    if (!!this.id) {
      this.searchLogService.getElement({ id: this.id }).subscribe(response => {
        this.factsheetAddForm = this.fb.group({
          'title': [response.name, [
            Validators.required,
          ]],
        });

      })
    }
  }


  submit(): void {
    const params = {
      id: this.id,
      title: this.title.value,
    }
    console.log('params', params);

    if (!!this.id) {
      params.id = this.id;
      this.searchLogService.updatefactsheet(params).subscribe(response => {
        this.bsModalRef.hide();
        this.afterAdd.emit(response);
      });
      } else {
        this.searchLogService.addAssociated(params).subscribe(response => {
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
